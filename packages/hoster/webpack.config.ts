import { resolve }                from 'path';
import Chain, { LoaderOptions }   from 'webpack-chain';
import { VueLoaderOptions }       from 'vue-loader';
import { TransformOptions }       from 'babel-core';
import { Options as SassOptions } from 'sass';
import webpack                    from 'webpack';
import { Options as TSOptions }   from 'ts-loader';
import LoaderContext = webpack.loader.LoaderContext;


export interface BabelLoaderOptions extends TransformOptions, LoaderOptions {
    customize?: string
    cacheDirectory?: boolean
    cacheCompression?: boolean
    compact?: boolean
    configFile?: boolean
}

export interface StyleLoaderOptions extends LoaderOptions {
    /** Allows to setup how styles will be injected into DOM (https://github.com/webpack-contrib/style-loader#injecttype) */
    injectType?:
        'styleTag'
        | 'singletonStyleTag'
        | 'lazyStyleTag'
        | 'lazySingletonStyleTag'
        | 'linkTag'
    /** Adds custom attributes to tag (https://github.com/webpack-contrib/style-loader#attributes) **/
    attributes?: any
    /** Inserts `<style>`/`<link>` at the given position (https://github.com/webpack-contrib/style-loader#insert) */
    insert?: string | Function
    /** Sets module ID base for DLLPlugin (https://github.com/webpack-contrib/style-loader#base) */
    base?: number
}

export interface CssLoaderOptions extends LoaderOptions {
    /** Enables/Disables 'url'/'image-set' functions handling (https://github.com/webpack-contrib/css-loader#url) */
    url?: boolean | Function
    /** Enables/Disables '@import' at-rules handling (https://github.com/webpack-contrib/css-loader#import). */
    import?: boolean | Function
    /** Enables/Disables CSS Modules and their configuration (https://github.com/webpack-contrib/css-loader#modules). */
    modules?: boolean | ('local' | 'global') | {
        mode?: 'local' | 'global'
        localIdentName?: string
        localIdentRegExp?: string | RegExp
        context?: string
        hashPrefix?: string
        getLocalIdent?: boolean | Function
    }
    /** Enables/Disables generation of source maps (https://github.com/webpack-contrib/css-loader#sourcemap)*/
    sourceMap?: boolean
    /** Enables/Disables or setups number of loaders applied before CSS loader (https://github.com/webpack-contrib/css-loader#importloaders) */
    importLoaders?: boolean | number
    /** Style of exported classnames (https://github.com/webpack-contrib/css-loader#localsconvention) */
    localsConvention?: 'asIs' | 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
    /** Export only locals (https://github.com/webpack-contrib/css-loader#onlylocals) */
    onlyLocals?: boolean
}

export interface SassLoaderOptions extends LoaderOptions {
    /**
     * The special implementation option determines which implementation of Sass to use.
     *
     * By default the loader resolve the implementation based on your dependencies. Just add required implementation to package.json (sass or node-sass package) and install dependencies.
     */
    implementation?: any
    /** defaults values for Sass implementation    Options for Sass. */
    sassOptions?: SassOptions | ((loaderContext: LoaderContext) => SassOptions)
    /** Enables/Disables generation of source maps. */
    sourceMap?: boolean
    /** Prepends Sass / SCSS code before the actual entry file. */
    prependData?: string | ((loaderContext: LoaderContext) => SassOptions)
    /** Enables/Disables the default Webpack importer. (to resolve @import "~<module>" ) */
    webpackImporter?: boolean
}

const c = new Chain();
let mode;
c.mode(mode = process.env.PRODUCTION ? 'production' : 'development');
const isProd = mode === 'production';
const isDev  = !isProd;
const babelOptions: BabelLoaderOptions = {
    babelrc       : false,
    configFile    : false,
    cacheDirectory: false,
    compact       : isProd,
    sourceMaps    : isDev,
    presets       : [
        [ 'vue-app' ],
    ],
};

const typescriptOptions: Partial<TSOptions> = {
    transpileOnly: true,
    // configFile           : tsconfig,
    appendTsSuffixTo: [ /\.vue$/ ],
    compilerOptions : {
        target         : 'es6' as any,
        module         : 'esnext' as any,
        inlineSourceMap: false,
        inlineSources  : false,
        removeComments : isProd,
        sourceMap      : isDev,
    },
};



c.entry(resolve('./src/ui/main.ts'));

c.module.rule('js')
    .test(/\.(js|mjs|jsx)$/)
    .use('babel-loader').loader('babel-loader').options(babelOptions).end();

c.module.rule('ts')
    .test(/\.(ts|tsx)$/)
    .use('babel-loader').loader('babel-loader').options(babelOptions).end()
    .use('ts-loadaer').loader('ts-loader').options(typescriptOptions);


c.module.rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader('vue-loader')
    .options(<VueLoaderOptions>{
        productionMode : isProd,
        compilerOptions: {
            preserveWhitespace: false,
        },
    });
