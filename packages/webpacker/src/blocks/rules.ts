import { Webpacker }                                                                                                                                                                                           from '../core/Webpacker';
import { BabelLoaderOptions, CacheLoaderOptions, CssLoaderOptions, ExposeLoaderOptions, FileLoaderOptions, PugLoaderOptions, SassLoaderOptions, StyleLoaderOptions, StylusLoaderOptions, ThreadLoaderOptions } from '../interfaces';
import { Options as TypescriptLoaderOptions }                                                                                                                                                                  from 'ts-loader';
import { VueLoaderOptions }                                                                                                                                                                                    from 'vue-loader';
import { Options as TsImportOptions }                                                                                                                                                                          from 'ts-import-plugin/lib/index';
import { merge }                                                                                                                                                                                               from 'lodash';
import tsImportPlugin                                                                                                                                                                                          from 'ts-import-plugin';
import { basename, join }                                                                                                                                                                                      from 'path';
import { camel2Dash }                                                                                                                                                                                          from '../utils/camel2dash';

export const images               = Webpacker.defineRule<FileLoaderOptions>('images', (w, r, o) => {
    return r.depends('file-loader')
        .test(/\.(png|jpg|gif|svg)$/)
        .use('file-loader').loader('file-loader')
        .options({
            name: '[name].[ext]?[hash]',
            ...o,
        });
});
export const fonts                = Webpacker.defineRule<FileLoaderOptions>('fonts', (w, r, o) => {
    return r.depends('file-loader')
        .test(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/)
        .use('file-loader').loader('file-loader')
        .options({
            name      : '[name].[ext]',
            outputPath: 'fonts/',
            ...o,
        });
});
export const css                  = Webpacker.defineRule<{ style?: StyleLoaderOptions, css?: CssLoaderOptions }>('css', (w, r, o) => {
    return r.depends('style-loader', 'css-loader')
        .test(/\.css/)
        .use('style-loader').loader('style-loader').options({ ...w.settings.styleLoader, ...(o.style || {}) }).end()
        .use('css-loader').loader('css-loader').options({ ...w.settings.cssLoader, ...(o.css || {}) }).end();
});
export const scss                 = Webpacker.defineRule<{ style?: StyleLoaderOptions, css?: CssLoaderOptions, scss?: SassLoaderOptions }>('scss', (w, r, o) => {
    return r.depends('style-loader', 'css-loader', 'sass', 'sass-loader', '@types/sass', '@types/sass')
        .test(/\.scss/)
        .use('style-loader').loader('style-loader').options({ ...w.settings.styleLoader, ...(o.style || {}) }).end()
        .use('css-loader').loader('css-loader').options({ ...w.settings.cssLoader, ...(o.css || {}) }).end()
        .use('sass-loader').loader('sass-loader').options(<SassLoaderOptions>
            merge({
                sassOptions: {
                    outputStyle: w.isProd ? 'compressed' : 'expanded',
                    sourceMap  : w.settings.sourceMap,
                },
            }, o.scss || {}),
        ).end();
});
export const stylus               = Webpacker.defineRule<{ style?: StyleLoaderOptions, css?: CssLoaderOptions, stylus?: StylusLoaderOptions }>('stylus', (w, r, o) => {
    return r.depends('style-loader', 'css-loader', 'stylus', 'stylus-loader', '@types/stylus')
        .test(/\.styl(us)?$/)
        .use('style-loader').loader('style-loader').options({ ...w.settings.styleLoader, ...(o.style || {}) }).end()
        .use('css-loader').loader('css-loader').options({ ...w.settings.cssLoader, ...(o.css || {}) }).end()
        .use('stylus-loader').loader('stylus-loader').options({
            preferPathResolver: 'webpack',
            sourceMap         : w.settings.sourceMap,
            ...(o.stylus || {}),
        }).end();
});
export const sourceMaps           = Webpacker.defineRule('source-map', (w, r, o) => {
    return r.depends('source-map-loader')
        .test(/\.js$/)
        // .include.merge([ /vue/ ]).end()
        .pre()
        .use('source-map-loader')
        .loader('source-map-loader');
});
export const addSourceMapIncludes = Webpacker.wrap((wp: Webpacker, includes: any[]) => {
    wp.module.rule('source-map').include.merge(includes).end();
});

export const vue    = Webpacker.defineRule<VueLoaderOptions>('vue', (w, r, o) => {
    return r.depends('vue-loader', 'vue-template-compiler')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader('vue-loader')
        .options(<VueLoaderOptions>{
            productionMode : w.isProd,
            compilerOptions: {
                preserveWhitespace: false,
            },
            ...o,
        });
});
export const pug    = Webpacker.defineRule<PugLoaderOptions>('pug', (w, r, o) => {
    return r.depends('pug', '@types/pug')
        .test(/\.pug$/)
        .oneOf('pugp')
        .resourceQuery(/^\?vue/)
        .use('pug-plain-loader')
        .loader('pug-plain-loader')
        .end()
        .end()
        .oneOf('spdf')
        .use('pug-loader')
        .loader('pug-loader')
        .options({
            pretty: true,
            ...o,
        }) as any;
});
export const expose = Webpacker.defineRule<ExposeLoaderOptions>('expose', (w, r, o) => {
    if ( typeof o === 'string' ) {
        o = { name: o };
    }
    return r
        .depends('expose-loader')
        .test(o.test ? o.test : require.resolve(o.name))
        .use('expose-loader')
        .loader('expose-loader')
        .options((o.as ? o.as : o.name) as any);
});
export const thread = Webpacker.defineRule<ThreadLoaderOptions>('thread', (w, r, o) => {
    return r
        .depends('thread-loader')
        .use('thread-loader')
        .loader('thread-loader')
        .options(<ThreadLoaderOptions>{
            ...o,
        });
});
export const cache  = Webpacker.defineRule<CacheLoaderOptions>('cache', (w, r, o) => {
    return r
        .depends('cache-loader')
        .use('cache-loader')
        .loader('cache-loader')
        .options(<CacheLoaderOptions>{
            ...o,
        });
});

export const babel              = Webpacker.defineRule<BabelLoaderOptions>('babel', (w, r, o) => {
    return r.depends(...[
        '@types/babel-core',
        '@babel/core',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
        '@babel/preset-env',
        'babel-loader',
        'babel-plugin-import',
    ])
        .use('babel-loader').loader('babel-loader')
        .loader('babel-loader')
        .options(merge(w.settings.get('babel') as any, o || {}));
});
export const babelImport        = Webpacker.wrap((wp: Webpacker, _options: Partial<TsImportOptions> | Array<Partial<TsImportOptions>>, ruleName = 'babel') => {
    // options = [ { libraryName: 'lodash', libraryDirectory: null, camel2DashComponentName: false } ];
    return wp.module.rule(ruleName)
        .use('babel-loader')
        .tap((options: BabelLoaderOptions) => {
            options.plugins.push(
                [ 'import', _options ],
            );
            return options;
        });
});
export const babelImportPresets = {
    lodash: { libraryName: 'lodash', libraryDirectory: null, camel2DashComponentName: false },
};

export const typescript = Webpacker.defineRule<Partial<TypescriptLoaderOptions>>('typescript', (w, r, o) => {
    return r.depends('typescript', 'ts-node', '@types/node', 'ts-import-plugin')
        .use('ts-loader').loader('ts-loader')
        .loader('ts-loader')
        .options(<Partial<TypescriptLoaderOptions>>merge({
            transpileOnly   : true,
            // configFile           : tsconfig,
            appendTsSuffixTo: [ /\.vue$/ ],
            compilerOptions : {
                target         : 'es5',
                module         : 'esnext',
                inlineSourceMap: false,
                inlineSources  : false,
                removeComments : w.isProd,
                sourceMap      : w.isDev,
            },
        } as any, o || {}));
});

// export const typescriptImport        = Webpacker.wrap((wp: Webpacker, _options?: Partial<TsImportOptions> | Array<Partial<TsImportOptions>>, ruleName = 'typescript') => {
//     // options = [ { libraryName: 'lodash', libraryDirectory: null, camel2DashComponentName: false } ];
//     return wp.module.rule(ruleName)
//         .use('ts-loader')
//         .tap((options: TypescriptLoaderOptions) => {
//             options.getCustomTransformers = () => ({
//                 before: [ tsImportPlugin(_options) ],
//             });
//             return options;
//         });
// });
export const typescriptImport        = Webpacker.wrap((wp: Webpacker, importOptions?: Partial<TsImportOptions> | Array<Partial<TsImportOptions>>, ruleName = 'typescript') => {
    // options = [ { libraryName: 'lodash', libraryDirectory: null, camel2DashComponentName: false } ];
    return wp.module.rule(ruleName)
        .use('ts-loader')
        .tap((options: TypescriptLoaderOptions) => {
            let otherTransformers: any = (): any => ({});
            if ( typeof options.getCustomTransformers === 'function' ) {
                otherTransformers = options.getCustomTransformers;
            }
            options.getCustomTransformers = (...params) => {
                let { before, after, afterDeclarations } = otherTransformers(...params);
                return {
                    before           : [ ...(before || []), tsImportPlugin(importOptions) ],
                    after            : [ ...(after || []) ],
                    afterDeclarations: [ ...(afterDeclarations || []) ],
                };
            };
            return options;
        });
});
export const typescriptImportPresets = {
    lodash   : { libraryName: 'lodash', libraryDirectory: null, camel2DashComponentName: false },
    elementUI: {
        libraryName            : 'element-ui',
        libraryDirectory       : 'lib',
        camel2DashComponentName: true,
        style                  : (path: string) => join('node_modules', 'element-theme-scss', 'lib', `${camel2Dash(basename(path, '.js'))}.css`),
    },
};
