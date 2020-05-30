import { OutputOptions, rollup, RollupOptions }        from 'rollup';
import { IOptions }                                    from 'rollup-plugin-typescript2/dist/ioptions';
import cleanup                                         from 'rollup-plugin-cleanup';
// noinspection ES6UnusedImports
import commonjs, { RollupCommonJSOptions }             from 'rollup-plugin-commonjs';
// noinspection ES6UnusedImports
import copy, { CopyOptions }                           from 'rollup-plugin-copy';
// noinspection ES6UnusedImports
import node_resolve, { Options as NodeResolveOptions } from 'rollup-plugin-node-resolve';
// noinspection ES6UnusedImports
import terser, { Options as TerserOptions }            from 'rollup-plugin-terser';
// noinspection ES6UnusedImports
import vue, { VuePluginOptions }                       from 'rollup-plugin-vue';
import { CompilerOptions }                             from 'typescript';
import typescript                                      from 'rollup-plugin-typescript2';
import { merge }                                       from 'lodash';
import gulpTs                                          from 'gulp-typescript';
import { emptyDirSync, rmdirSync }                     from 'fs-extra';
import { existsSync, statSync, unlinkSync }            from 'fs';
import { resolve }                                     from 'path';
import gulp                                            from 'gulp';

type TypescriptPluginCompilerOptionsOptions = Omit<CompilerOptions, 'target'> & {
    target?:
        'es3' | // 'ES3'
        'es5' | // 'ES5'
        'es2015' | // 'ES2015'
        'es2016' | // 'ES2016'
        'es2017' | // 'ES2017'
        'es2018' | // 'ES2018'
        'es2019' | // 'ES2019'
        'es2020' | // 'ES2020'
        'esnext' | // 'ESNext'
        'json' | // 'JSON'
        'latest' // 'Latest'
    module?:
        'none' |// 'None'
        'commonjs' |// 'CommonJS'
        'amd' |// 'AMD'
        'umd' |// 'UMD'
        'system' |// 'System'
        'es2015' |// 'ES2015'
        'esnext' // 'ESNext'
    jsx?:
        'none' |
        'preserve' |
        'react' |
        'react-native'
}

interface TypescriptPluginOptions extends Partial<IOptions> {
    tsconfigOverride?: {
        [ k: string ]: any
        compilerOptions?: TypescriptPluginCompilerOptionsOptions
    }
    tsconfigDefaults?: {
        [ k: string ]: any
        compilerOptions?: TypescriptPluginCompilerOptionsOptions
    }
}

interface DefaultPluginOptions {
    cleanup?: cleanup.Options
    typescript?: TypescriptPluginOptions
    commonjs?: RollupCommonJSOptions
    copy?: CopyOptions
    nodeResolve?: NodeResolveOptions
    terser?: TerserOptions
    vue?: VuePluginOptions
}

export interface DefaultRollupOptions extends Omit<RollupOptions, 'plugins'> {
    plugins?: DefaultPluginOptions
    output?: OutputOptions[]
}

const defaultOptions: DefaultRollupOptions = {
    input  : './src/index.ts',
    plugins: {
        cleanup   : {
            include: [ 'lib', 'module', 'es' ],
        },
        typescript: {
            tsconfig        : './tsconfig.build.json',
            tsconfigOverride: {},
        },
    },
};

export function createOptionsFromDefaults(options: DefaultRollupOptions[], plugins = {}): Omit<RollupOptions, 'output'> & { output: OutputOptions[] } {
    plugins                          = { cleanup, typescript, commonjs, copy, node_resolve, terser, vue, ...plugins };
    let rollupOptions: RollupOptions = merge({}, defaultOptions, ...options) as RollupOptions;
    rollupOptions.plugins            = Object.getOwnPropertyNames(rollupOptions.plugins).map(pluginName => {
        return plugins[ pluginName ](rollupOptions.plugins[ pluginName ]);
    });
    return rollupOptions as any;
}

async function build() {

    const cleanPaths = [ 'lib', 'es', 'dist', 'types' ];
    for ( let cleanPath of cleanPaths ) {
        cleanPath = resolve(cleanPath);
        if ( !existsSync(cleanPath) ) {
            continue;
        }
        if ( statSync(cleanPath).isDirectory() ) {
            emptyDirSync(cleanPath);
            rmdirSync(cleanPath);
            console.log(`- removed directory ${cleanPath}.`);
            continue;
        }
        unlinkSync(cleanPath);
        console.log(`- removed file ${cleanPath}.`);
    }
    const bundle = await rollup(createOptionsFromDefaults([ {
        plugins: {
            typescript: {
                clean           : true,
                include         : './src/**/*.ts',
                tsconfigOverride: {
                    compilerOptions: {
                        target     : 'es2016',
                        module     : 'esnext',
                        declaration: false,
                    },
                },
            },

        },
    } ]));

    const outputs: OutputOptions[] = [
        { file: 'dist/utils.esm.js', format: 'esm', name: '@radic/utils' },
        { file: 'dist/utils.umd.js', format: 'umd', name: '@radic/utils' },
        { file: 'dist/utils.esm.min.js', format: 'esm', name: '@radic/utils' },
        { file: 'dist/utils.umd.min.js', format: 'umd', name: '@radic/utils' },
    ];

    for ( const output of outputs ) {
        // await bundle.generate(output);
        await bundle.write(output);
        console.log(`- bundle written to ${output.file || output.dir}.`);
    }

    let projects: Record<string, gulpTs.Settings> = {
        lib  : { outDir: 'lib' },
        es   : { module: 'esnext', outDir: 'es' },
        types: { declaration: true, declarationDir: 'types', outDir: 'types', emitDeclarationOnly: true },
    };
    let names                                     = Object.keys(projects);
    for ( const name of names ) {
        const settings = projects[ name ];
        gulp.task(name, () => gulp
            .src('src/**/*.ts')
            .pipe(gulpTs.createProject('tsconfig.build.json', settings)())
            .pipe(gulp.dest(settings.outDir)),
        );
    }

    const runGulp = async (tasks) => new Promise((resolve, reject) => gulp.parallel(tasks)(error => {
        error ? reject(error) : resolve();
    }));

    await runGulp(names);

}

build();


