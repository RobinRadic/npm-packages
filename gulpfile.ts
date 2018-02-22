//region: IMPORTS
import * as gulp from 'gulp';
import { WatchEvent } from 'gulp';
import * as gutil from 'gulp-util';
import * as gts from 'gulp-typescript';
import * as ts from 'typescript';
// noinspection ES6UnusedImports
import * as shelljs from 'shelljs';
import { touch } from 'shelljs';
import * as globule from 'globule';
import { basename, join, resolve } from 'path';
import * as _ from 'lodash';
import { existsSync, statSync, writeFileSync } from 'fs';
import { exec, execSync } from 'child_process';
import { GulpTypedocOptions, IdeaIml, IdeaJsMappings, PackageData, RGulpConfig, TSProjectOptions } from './scripts/interfaces';
import * as yargs from 'yargs';
import { Radic } from './scripts/Radic';
import * as scss from 'node-sass';
import * as pug from 'pug';
import * as browserSync from 'browser-sync';
import * as sequence from 'run-sequence';
import { isArray } from 'util';
import { Template } from './scripts/Template';
import * as ghPages from 'gulp-gh-pages';
import { writeJsonSync } from 'fs-extra';
import * as commonjs from 'rollup-plugin-commonjs';
// noinspection ES6UnusedImports
import * as rollup from 'rollup'
// noinspection ES6UnusedImports
import * as nresolve from 'rollup-plugin-node-resolve'
import typedoc = require('gulp-typedoc');
// noinspection ES6UnusedImports
import mdtoc            = require('markdown-toc');

sequence.use(<any> gulp);

const clean            = require('gulp-clean')
const pump             = require('pump')
const DependencySorter = require('dependency-sorter')
const docsServer       = browserSync.create();

//endregion

//region: CONFIG
const c: RGulpConfig = {
    idea           : true,
    templatesPath  : resolve('./scripts/templates'),
    pkg            : require('./package.json'),
    lerna          : require('./lerna.json'),
    log            : {
        level        : 'info',
        useLevelIcons: true,
        timestamp    : true
    },
    ts             : {
        config    : require('./tsconfig.json'),
        taskPrefix: 'ts',
        defaults  : <TSProjectOptions>{
            typescript     : ts,
            // declaration    : true,
            inlineSourceMap: false,
            inlineSources  : false
        }
    },
    ghPages        : {
        origin   : 'origin',
        branch   : 'gh-pages',
        push     : true,
        message  : 'update [timestamp]',
        cacheDir : '.tmp/publish',
        remoteUrl: 'https://github.com/robinradic/npm-packages/'
    },
    templates      : {
        readme: {
            firsth1: true,
            bullets: '-'
        },
        docs  : {
            scss     : {
                outFile: './docs/index.css'
            },
            pug      : {
                pretty: true
            },
            pugLocals: {
                baseUrl      : 'https://robin.radic.nl/npm-packages/',
                lodash       : _,
                githubUrl    : 'https://github.com/robinradic/npm-packages',
                githubForkUrl: 'https://github.com/robinradic/npm-packages/fork'
            }
        }
    },
    packageDefaults: {
        radic: {
            typedoc: {
                module              : 'commonjs',
                mode                : 'file',
                target              : 'es6',
                hideGenerator       : false,
                json                : 'docs/typedoc.json',
                verbose             : true,
                out                 : 'docs',
                includeDeclarations : false,
                excludeExternals    : true,
                ignoreCompilerErrors: true,
                includes            : resolve('scripts/templates/typedoc/inc'),
                theme               : resolve('scripts/templates/typedoc/theme'),
                plugins             : [
                    'typedoc-plantuml'
                    // 'typedoc-plugin-markdown',
                    // 'typedoc-plugin-single-line-tags',
                    // 'typedoc-plugin-sourcefile-url'
                ],
                exclude             : [ 'types', 'test' ].join(',')
            }
        }
    }
};
//endregion


//region: HELPERS, CLASSES, FUNCTIONS
//IO
const r       = new Radic(c);
const defined = (val) => val !== undefined
const info    = r.log.bind(r)
const log     = r.log.bind(r)
const error   = r.error.bind(r)
Object.assign(gutil, { log: (msg, ...optional) => info(msg, ...optional) });
//endregion


//region: RESOLVE PACKAGES
const packagePaths            = globule
    .find('packages/*')
    .map(path => resolve(path))
    .filter(path => statSync(path).isDirectory());
// noinspection ReservedWordAsName
const packages: PackageData[] = new DependencySorter({ idProperty: 'name' }).sort(packagePaths.map(path => {

    const pkg     = require(resolve(path, 'package.json'))
    // general data
    const data    = <PackageData> {
        path        : {
            toString: () => resolve(path),
            to      : (...args: string[]) => resolve.apply(null, [ path ].concat(args)),
            glob    : (pattern: string | string[]) => _.toArray(pattern).map(pattern => resolve(path, pattern))
        },
        directory   : basename(path),
        package     : pkg,
        name        : pkg.name,
        tsconfig    : require(resolve(path, 'tsconfig.json')),
        depends     : Object.keys(pkg.dependencies),
        dependencies: pkg.dependencies
    }
    data.hasTests = existsSync(data.path.to('test'));

    // apply package defaults
    data.package = _.merge(data.package, {
        radic: c.packageDefaults.radic
    }, data.package)

    // Radic options (in package.json)
    if ( defined(data.package.radic) ) {
        // Typedoc options. Apply defaults, correct paths, etc
        if ( defined(data.package.radic.typedoc) && data.package.radic.typedoc !== false ) {
            let typedocOptions: GulpTypedocOptions = <GulpTypedocOptions>_.merge({}, c.packageDefaults.radic.typedoc, data.package.radic.typedoc);
            typedocOptions.out                     = join('docs', data.name.replace('/', '-'));
            typedocOptions.json                    = join('docs', data.name.replace('/', '-'), 'typedoc.json');
            [ 'readme' ].forEach(key => {
                if ( typedocOptions[ key ] !== undefined ) {
                    typedocOptions[ key ] = data.path.to(typedocOptions[ key ]);
                }
            })
            data.package.radic.typedoc = typedocOptions;
        }
    }

    return data;
}));

const packageNames = packages.map(pkg => pkg.name);
//endregion


//region: TEMPLATE PARSERS
_.merge(c.templates.docs.pugLocals, { packageNames, packages, packagePaths })
r.addTemplateParser('pug', function (this: Template, content: string) {

    let compile = pug.compile(content,_.merge(c.templates.docs.pug, <pug.Options>{
        pretty  : true,
        filename: this.getFilePath(),
        basedir : resolve('scripts/templates/docs')
    }));
    return compile(c.templates.docs.pugLocals)
})
r.addTemplateParser('scss', function (this: Template, content: string) {
    let result = scss.renderSync({
        file: this.getFilePath()
    })
    content    = result.css.toString();
    return content;
})
// r.addTemplateParser('md', content => mdtoc(content, {}).content)

r.addTemplateParser('mdtoc', (content) => {
    let toc = mdtoc(content, c.templates.readme)
    return content.replace('[[TOC]]', toc.content);
});
// r.addTemplateParser('scss', (content) => {
//     let result = scss.renderSync(_.merge(c.templates.docs.scss, {
//         data: content
//
//     }))
//     return result.css.toString();
// })
// r.addTemplateParser('pug', (content) => {
//     const compile = pug.compile(content, _.merge(c.templates.docs.pug, <pug.Options>{
//         pretty  : true,
//         filename: 'index.pug',
//         basedir : resolve('scripts/templates/docs')
//     }))
//     return compile(c.templates.docs.pugLocals);
// })
//endregion


//region: TASKS:TYPESCRIPT
// the package task prefix names for src (populates by createTsTask() calls)
// - used to afterwards create [clean,build,watch]:ts:${packageName} task name array
// - and uses the array as dependencies for creation of [clean,build,watch]:ts tasks
let srcNames = []
// the package task prefix names for test works same as src but
// creates [clean,build,watch]:ts:test:${packageName} task name array for the [clean,build,watch]:ts:test tasks
let testNames      = []
const createTsTask = (name: string, pkg: PackageData, dest, tsProject: TSProjectOptions = {}) => {

    //region: clean, build and watch tasks for the src directory
    // need to manually set up clean paths because the src directory will be compiled into its parent directory, the package root
    // we can not just delete all directories in the package root (obvious)
    // - gets the declaration dir name > prefixes package root path > cleanPaths
    // - gets src dir names > prefixes package root path > cleanPaths
    // - gets src dir root .js file names > prefixes package root path > cleanPaths
    let cleanPaths = [ pkg.path.to(require(pkg.path.to('tsconfig.json')).compilerOptions.declarationDir) ]
        .concat(
            globule
                .find(join(pkg.path.to('src'), '**/*'))
                .filter(path => statSync(path).isDirectory())
                .map(path => path.replace(pkg.path.to('src'), pkg.path.toString()))
        )
        .concat(globule.find(join(pkg.path.to('*.{js,js.map,d.ts}'))))

    if ( pkg.package.radic.typedoc !== false ) {
        gulp.task('docs:' + name, () => gulp.src(pkg.path.to('src/**/*.ts')).pipe(typedoc(_.merge(pkg.package.radic.typedoc as any, <GulpTypedocOptions> {
            name: pkg.directory,
            out : `./docs/${pkg.directory}`,
            json: `docs/${pkg.directory}/typedoc.json`
        }))))
        cleanPaths.push(pkg.package.radic.typedoc.out)
    }
    gulp.task('clean:' + name, (cb) => gulp.src(cleanPaths).pipe(clean()));
    gulp.task('build:' + name, (cb) => {
        // Run Typescript Compiler
        exec(resolve('node_modules/.bin/tsc'), { cwd: pkg.path + '' })
            .on('exit', () => {
                writeFileSync(pkg.path.to('index.d.ts'), 'export * from "./types"', 'utf-8')
                cb()
            })
    })
    gulp.task('watch:' + name, () => {
        gulp.watch([ pkg.path.to('src/**/*.ts'), pkg.path.to('test/**/*.ts') ], (event: WatchEvent) => {
            gulp.start('build:' + name, 'idea')
        })
    });
    if ( pkg.package.radic.es === true ) {
        gulp.task('build:' + name + ':es', (cb) => {

            exec(resolve('node_modules/.bin/tsc --module es2015 --outDir es/'), { cwd: pkg.path + '' })
                .on('exit', () => {
                    cb()
                })
        })
        // gulp.task('build:' + name + ':es', (cb) =>
        //     gulp.src([pkg.path.to('src/*.ts'),pkg.path.to('src/**/*.ts')]).pipe(
        //     gts.createProject(pkg.path.to('tsconfig.json'), {
        //         declaration: false,
        //         outDir     : pkg.path.to('es'),
        //         module     : 'es2015'
        //     })()).pipe(gulp.dest(pkg.path.to('es')))
        // )
        // gulp.task('build:' + name + ':es', async () => {
        //     const bundle = await rollup.rollup({
        //         entry   : pkg.path.to('index.js'),
        //         external: [ 'lodash' ],
        //         plugins : [
        //             nresolve({
        //                 jsnext: true,
        //                 main  : true
        //             }),
        //             commonjs({ include: 'node_modules/**' })
        //         ]
        //     });
        //     await bundle.write({
        //         dest     : pkg.path.to('es/'),
        //         format   : 'es',
        //         name     : 'radic-util',
        //         sourcemap: true
        //     });
        // });

        //     gulp.src(pkg.path.to('es/**/*.js')),
        //     rollup({
        //         input     : pkg.path.to('es/index.js'),
        //         format    : 'umd',
        //         moduleName: name,
        //         globals   : {}
        //     }),
        //     gulp.dest(pkg.path.to('./radic.util.umd.js')),
        //     // clean(),
        //     // rename(o.umd.fileName),
        //     // gulp.dest(o.dests.umd))
        // ]))
    }
    srcNames.push(name)
    //endregion


    let hasTests = existsSync(pkg.path.to('test'));
    //region: clean, build and watch tasks for the test directory
    if ( hasTests ) {
        gulp.task(`clean:${name}:test`, (cb) => gulp.src([ pkg.path.to('test/**/*.{js,js.map}'), pkg.path.to('coverage') ]).pipe(clean()));//, (err) => cb(err)) });
        gulp.task(`build:${name}:test`, (cb) => {
            let testProject = gts.createProject(pkg.path.to('tsconfig.json'), <TSProjectOptions> {
                declaration: false, outDir: './test', rootDir: './'
            });
            delete testProject.options.declarationDir
            return gulp.src(pkg.path.to('test/**/*.ts'))
                .pipe(testProject())
                .pipe(gulp.dest(pkg.path.to('test')))
        })
        gulp.task(`watch:${name}:test`, () => {
            gulp.watch(pkg.path.to('test/**/*.ts'), (event: WatchEvent) => {
                gulp.start(`build:${name}:test`)
            })
        });
        testNames.push(`${name}:test`);
    }
    //endregion
}
packages.forEach(pkg => createTsTask(`${pkg.directory}:${c.ts.taskPrefix}`, pkg, '/', {}));
// src
[ 'docs', 'build', 'clean', 'watch' ].forEach(prefix => gulp.task(`${prefix}:ts`, srcNames.map(name => `${prefix}:${name}`)));
// test
[ 'build', 'clean', 'watch' ].forEach(prefix => gulp.task(`${prefix}:ts:test`, testNames.map(name => `${prefix}:${name}`)));
//endregion

//region: TASKS: PACKAGE.JSON DEFAULTS
let defaultPackageJson = require('./scripts/templates/package.json')
let pkgjsTaskNames     = []
packages.forEach(pkg => {
    let taskName = 'build:' + pkg.directory + ':pkgjs';
    pkgjsTaskNames.push(taskName)
    gulp.task(`clean:${taskName}:pkgjs`, (cb) => cb()) // fake task
    gulp.task(taskName, (cb) => {
        let packageJson      = _.merge(require(pkg.path.to('package.json')), defaultPackageJson)
        packageJson.homepage = 'http://robin.radic.nl/npm-packages/' + pkg.directory
        writeJsonSync(pkg.path.to('package.json'), packageJson, { encoding: 'utf-8', spaces: 4 });
        cb();
    })
})
gulp.task('build:pkgjs', pkgjsTaskNames);
//endregion

packages.forEach(pkg => {
    let name = pkg.directory;
    [ 'build', 'clean' ].forEach(prefix => gulp.task(`${prefix}:${name}`, (cb) => sequence(`${prefix}:${name}:ts`, `${prefix}:${name}:ts:test`, `${prefix}:${name}:pkgjs`)));
})

//region: TASKS:INTELLIJ
if ( c.idea ) {
    gulp.task('idea', (cb) => {
        const url       = (...parts: any[]) => [ 'file://$MODULE_DIR$' ].concat(join.apply(null, parts)).join('')
        let editIml     = existsSync(resolve('.idea/libraries/tsconfig_roots.xml')),
              editJsMap = existsSync(resolve('.idea/jsLibraryMappings.xml'));

        if ( editIml || editJsMap ) {
            const xmlEdit = require('gulp-edit-xml')
            /** @link https://github.com/t1st3/muxml#options **/
            const muxml   = require('gulp-muxml')
            if ( editIml ) {
                const getDirs = (name: string, filter: (path: string) => boolean): string[] => packages
                    .map(pkg => pkg.path.to(name))
                    .filter(path => {
                        return existsSync(path)
                    })
                    .filter(path => {
                        return statSync(path).isDirectory()
                    })
                    .map(path => {
                        path = url(path.replace(__dirname, ''))
                        return path
                    })
                    .filter(filter)

                gulp.src('.idea/*.iml')
                    .pipe(xmlEdit((xml: IdeaIml) => {
                        // remote tsconfig$roots
                        xml.module.component[ 0 ].orderEntry = xml.module.component[ 0 ].orderEntry.filter(entry => entry.$.name !== 'tsconfig$roots')
                        const content                        = xml.module.component[ 0 ].content[ 0 ];
                        content.excludeFolder                = content.excludeFolder || []
                        content.sourceFolder                 = content.sourceFolder || []
                        const excludeFolders: string[]       = content.excludeFolder.map(sf => sf.$.url)
                        const sourceFolders: string[]        = content.sourceFolder.map(sf => sf.$.url)

                        // ensure we exclude all types folders
                        getDirs('types', path => ! excludeFolders.includes(path)).forEach(url => {
                            content.excludeFolder.push({ $: { url } })
                        })

                        // ensure we test all test folders
                        getDirs('test', path => ! sourceFolders.includes(path)).forEach(url => {
                            content.sourceFolder.push({ $: { url, isTestSource: 'true' } })
                        })

                        // ensure we source all src folders
                        getDirs('src', path => ! sourceFolders.includes(path)).forEach(url => {
                            content.sourceFolder.push({ $: { url, isTestSource: 'false' } })
                        })
                        return xml;
                    }))
                    .pipe(muxml({ identSpaces: 2 }))
                    .pipe(gulp.dest('.idea/'))
            }
            if ( editJsMap ) {

                // noinspection TypeScriptUnresolvedFunction
                gulp.src('.idea/jsLibraryMappings.xml')
                    .pipe(xmlEdit((xml: IdeaJsMappings) => {
                        // if(xml.project.component.length > 0) {
                        if ( isArray(xml.project.component[ 0 ].file) ) {
                            xml.project.component[ 0 ].file.forEach((file, i) => {
                                if ( xml.project.component[ 0 ].file[ i ].$.libraries.includes('tsconfig$roots') ) {
                                    xml.project.component[ 0 ].file[ i ].$.libraries = xml.project.component[ 0 ].file[ i ].$.libraries
                                        .replace(', tsconfig$roots', '')
                                        .replace('tsconfig$roots, ', '')
                                        .replace('tsconfig$roots', '')
                                }
                            })
                        }
                        return xml;
                    }))
                    .pipe(muxml({ identSpaces: 2 }))
                    .pipe(gulp.dest('.idea/'))
            }
        }
        cb();
    })
}
//endregion


//region: TASKS: README / TYPEDOCS / GHPAGES
gulp.task('docs:templates', [ 'clean:docs:templates' ], (cb) => {
    // create index page / style
    r.template('docs/index.pug')
        .applyParsers([ 'pug' ])
        .writeTo('docs/index.html', true);
    log(`Compiled and written {cyan}templates/docs/index.pug{/cyan} to {cyan}docs/index.html{/cyan}`)


    r
        .template('docs/stylesheet.scss')
        .applyParsers(['scss'])
        .writeTo('docs/stylesheet.css', true);

    log(`Compiled and written {cyan}templates/docs/stylesheet.scss{/cyan} to {cyan}docs/index.scss{/cyan}`)
    cb()
})
gulp.task('docs:script', (cb) => {
    exec(resolve('node_modules/.bin/tsc'), { cwd: 'scripts/templates/docs' })
        .on('exit', () => {
            cb()
        })
})
gulp.task('docs:serve', [ 'docs' ], () => {
    c.templates.docs.pugLocals.baseUrl = '/';
    if ( docsServer.active ) {
        log('docServer already active. exiting')
        docsServer.exit();
    }
    log('docServer initializing')
    docsServer.init({
        server: {
            baseDir: './docs'
        }
    })
    log('watching {cyan}scripts/templates/**/*{/cyan}')
    gulp.watch('scripts/templates/**/*', () => {
        gulp.start('docs:templates', 'docs:script')
    }).on('change', () => {
        if ( docsServer.active ) {
            docsServer.reload()
        }
    })
    gulp.watch('docs/util/**/*', () => {
        gulp.start('docs:ts:util')
    }).on('change', () => {
        if ( docsServer.active ) {
            setTimeout(() => docsServer.reload(), 1000)

        }
    })
});
gulp.task('docs:readme', (cb) => {
    r
        .template('README.md')
        .applyParsers([ 'mdtoc' ])
        .writeTo('./README.md', true);
    cb()
})


gulp.task(`clean:docs`, (cb) => { pump(gulp.src('docs/*'), clean(), (err) => cb(err)) });
gulp.task(`clean:docs:templates`, (cb) => { pump(gulp.src('docs/{index.html,stylesheet.scss}'), clean(), (err) => cb(err)) });
gulp.task('docs', (cb) => sequence('clean:docs', 'docs:ts', 'docs:templates', 'docs:script', 'docs:readme', cb))
gulp.task('docs:ghpages', () => {
    touch('docs/.nojekyll');
    return gulp.src('./docs/**/*').pipe(ghPages(c.ghPages))
})
gulp.task('docs:deploy', (cb) => sequence('docs', 'docs:ghpages', cb))

//endregion


//region: TASKS: TESTING

packages.filter(pkg => pkg.hasTests).forEach(pkg => {
    gulp.task('test:' + pkg.directory, (cb) => {
        if ( pkg.package.scripts.test ) {
            execSync('lerna run test --scope ' + pkg.name, { stdio: 'inherit' })
            // execSync('yarn test', { cwd: pkg.path.toString(), stdio: 'inherit' });
        } else {
            execSync('nyc mocha', { cwd: pkg.path.toString(), stdio: 'inherit' });
        }
        cb();
    })
})
//endregion


//region: MAIN TASKS
gulp.task('clean', [ `clean:${c.ts.taskPrefix}`, `clean:${c.ts.taskPrefix}:test`, 'clean:docs' ])
gulp.task('build', [ 'clean' ], (cb) => sequence('build:pkgjs', `build:${c.ts.taskPrefix}`, `build:${c.ts.taskPrefix}:test`, 'idea', cb))
gulp.task('watch', [ 'build' ], () => gulp.start(`watch:${c.ts.taskPrefix}`, `watch:${c.ts.taskPrefix}:test`))
gulp.task('test', packages.filter(pkg => pkg.hasTests).map(pkg => 'test:' + pkg.directory))
gulp.task('list', (cb) => {
    let args = yargs
        .option({
            d: { alias: 'depth', type: 'number', default: 0 }
        })
        .parse(process.argv.slice(2))
    console.log('-'.repeat(50));
    console.log(`Listing tasks with a depth of ${args.depth}.`)
    console.log(`Depth equals the amount of ':' columns`)
    console.log(`Use the '--depth N' or '-d N' to view more tasks.`)
    console.log('-'.repeat(50));

    Object.keys(gulp.tasks)
        .filter(taskName => taskName.split(':').length <= args.depth + 1)
        .forEach(taskName => {
            let text = ` - ${gutil.colors.cyan(taskName)}`;
            if ( gulp.tasks[ taskName ].dep.length > 0 ) {
                text += ' > '
                text += gulp.tasks[ taskName ].dep.join(' > ')
            }
            console.log(text)
        })
    cb();
})
gulp.task('default', [ 'list' ])
gulp.task('tasks', [ 'list' ])
//endregion

if ( c.idea ) {
// always run the IntelliJ IDEA fixer
    gulp.start('idea')
}