import { TransformOptions } from 'babel-core';
import { LoaderOptions } from 'webpack-chain';
import { Options as PugOptions } from 'pug';
import { Dictionary } from './general';
export interface BabelLoaderOptions extends TransformOptions, LoaderOptions {
    customize?: string;
    cacheDirectory?: boolean;
    cacheCompression?: boolean;
    compact?: boolean;
    configFile?: boolean;
}
export interface StylusLoaderOptions extends LoaderOptions {
    globals?: Dictionary<any>;
    functions?: Dictionary<any>;
    imports?: string[];
    paths?: string[];
    filename?: string;
    Evaluator?: any;
}
export interface StyleLoaderOptions extends LoaderOptions {
    /** Allows to setup how styles will be injected into DOM (https://github.com/webpack-contrib/style-loader#injecttype) */
    injectType?: 'styleTag' | 'singletonStyleTag' | 'lazyStyleTag' | 'lazySingletonStyleTag' | 'linkTag';
    /** Adds custom attributes to tag (https://github.com/webpack-contrib/style-loader#attributes) **/
    attributes?: any;
    /** Inserts `<style>`/`<link>` at the given position (https://github.com/webpack-contrib/style-loader#insert) */
    insert?: string | Function;
    /** Sets module ID base for DLLPlugin (https://github.com/webpack-contrib/style-loader#base) */
    base?: number;
}
export interface CssLoaderOptions extends LoaderOptions {
    /** Enables/Disables 'url'/'image-set' functions handling (https://github.com/webpack-contrib/css-loader#url) */
    url?: boolean | Function;
    /** Enables/Disables '@import' at-rules handling (https://github.com/webpack-contrib/css-loader#import). */
    import?: boolean | Function;
    /** Enables/Disables CSS Modules and their configuration (https://github.com/webpack-contrib/css-loader#modules). */
    modules?: boolean | ('local' | 'global') | {
        mode?: 'local' | 'global';
        localIdentName?: string;
        localIdentRegExp?: string | RegExp;
        context?: string;
        hashPrefix?: string;
        getLocalIdent?: boolean | Function;
    };
    /** Enables/Disables generation of source maps (https://github.com/webpack-contrib/css-loader#sourcemap)*/
    sourceMap?: boolean;
    /** Enables/Disables or setups number of loaders applied before CSS loader (https://github.com/webpack-contrib/css-loader#importloaders) */
    importLoaders?: boolean | number;
    /** Style of exported classnames (https://github.com/webpack-contrib/css-loader#localsconvention) */
    localsConvention?: 'asIs' | 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly';
    /** Export only locals (https://github.com/webpack-contrib/css-loader#onlylocals) */
    onlyLocals?: boolean;
}
export interface PugLoaderOptions extends PugOptions, LoaderOptions {
}
export declare type ExposeLoaderOptions = string | {
    name: string;
    as?: string;
    test?: RegExp;
};
export interface CacheLoaderOptions extends LoaderOptions {
}
export interface ThreadLoaderOptions extends LoaderOptions {
    workers?: number;
    workerParallelJobs?: number;
    workerNodeArgs?: string[];
    poolRespawn?: boolean;
    poolTimeout?: number;
    poolParallelJobs?: number;
    name?: string;
}
export interface SpeedMeasureOptions {
    disable?: boolean;
    outputFormat?: 'json' | 'human' | 'humanVerbose' | ((blob: any) => string);
    outputTarget?: string | ((output: string) => string);
    pluginNames?: Record<string, string>;
    granularLoaderData?: boolean;
}
export declare type FileLoaderBuildResourcePathFn = (url: string, resourcePath: string, context: string) => string;
export interface FileLoaderOptions {
    /**
     * Specifies a custom filename template for the target file(s) using the query parameter name.
     *
     * By default the path and name you specify will output the file in that same directory,
     * and will also use the same URI path to access the file.
     *
     * For example, to emit a file from your context directory into the output directory retaining the full
     * directory structure, you might use:
     *
     * @example
     * module.exports = {
     *   module: {
     *     rules: [
     *       {
     *         test: /\.(png|jpe?g|gif)$/i,
     *         loader: 'file-loader',
     *         options: {
     *           name: '[path][name].[ext]',
     *         },
     *       },
     *     ],
     *   },
     * };
     *
     * @example
     * module.exports = {
     *  module: {
     *    rules: [
     *      {
     *        test: /\.(png|jpe?g|gif)$/i,
     *        loader: 'file-loader',
     *        options: {
     *          name(file) {
     *            if (process.env.NODE_ENV === 'development') {
     *              return '[path][name].[ext]';
     *            }
     *
     *            return '[contenthash].[ext]';
     *          },
     *        },
     *      },
     *    ],
     *  },
     * };
     *
     * @default '[contenthash].[ext]'
     */
    name?: string | ((file: string) => string);
    /**
     * Specify a filesystem path where the target file(s) will be placed.
     *
     * Function gets passes the original absolute path to the asset,
     * as well as the directory where assets are stored.
     *
     * @example
     * module.exports = {
     *   module: {
     *     rules: [
     *       {
     *         test: /\.(png|jpe?g|gif)$/i,
     *         loader: 'file-loader',
     *         options: {
     *           outputPath: (url, resourcePath, context) => {
     *             if (/my-custom-image\.png/.test(resourcePath)) {
     *               return `other_output_path/${url}`;
     *             }
     *
     *             if (/images/.test(context)) {
     *               return `image_output_path/${url}`;
     *             }
     *
     *             return `output_path/${url}`;
     *           },
     *         },
     *       },
     *     ],
     *   },
     * };
     *
     * @default undefined
     */
    outputPath?: string | FileLoaderBuildResourcePathFn;
    /**
     * Specifies a custom public path for the target file(s).
     *
     * Function gets passes the original absolute path to the asset,
     * as well as the directory where assets are stored.
     *
     * @example
     * module.exports = {
     *  module: {
     *    rules: [
     *      {
     *        test: /\.(png|jpe?g|gif)$/i,
     *        loader: 'file-loader',
     *        options: {
     *          publicPath: (url, resourcePath, context) => {
     *            if (/my-custom-image\.png/.test(resourcePath)) {
     *              return `other_public_path/${url}`;
     *            }
     *
     *            if (/images/.test(context)) {
     *              return `image_output_path/${url}`;
     *            }
     *
     *            return `public_path/${url}`;
     *          },
     *        },
     *      },
     *    ],
     *  },
     * };
     *
     * @default {@link https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific __webpack_public_path__}
     */
    publicPath?: string | FileLoaderBuildResourcePathFn;
    /**
     * Specifies a custom function to post-process the generated public path.
     *
     * This can be used to prepend or append dynamic global variables that are only available at runtime, like
     * `__webpack_public_path__`. This would not be possible with just publicPath, since it stringifies the values.
     *
     * @example
     * module.exports = {
     *   module: {
     *     rules: [
     *       {
     *         test: /\.(png|jpg|gif)$/i,
     *         loader: 'file-loader',
     *         options: {
     *           publicPath: '/some/path/',
     *           postTransformPublicPath: (p) => `__webpack_public_path__ + ${p}`,
     *         },
     *       },
     *     ],
     *   },
     * };
     *
     * @default undefined
     */
    postTransformPublicPath?: (p: string) => string;
    /**
     * Specifies a custom file context.
     *
     * @example
     * module.exports = {
     *   module: {
     *     rules: [
     *       {
     *         test: /\.(png|jpe?g|gif)$/i,
     *         use: [
     *           {
     *             loader: 'file-loader',
     *             options: {
     *               context: 'project',
     *             },
     *           },
     *         ],
     *       },
     *     ],
     *   },
     * };
     *
     * @default {@link https://webpack.js.org/configuration/entry-context/#context context}
     */
    context?: string;
    /**
     * If `true`, emits a file (writes a file to the filesystem); otherwise, the loader will return a public URI
     * but will not emit the file. It is often useful to disable this option for server-side packages.
     *
     * @default true
     */
    emitFile?: boolean;
    /**
     * Specifies a Regular Expression to one or many parts of the target file path.
     * The capture groups can be reused in the name property using [N]
     * {@link https://github.com/webpack-contrib/file-loader#placeholders placeholder}.
     *
     * If [0] is used, it will be replaced by the entire tested string,
     * whereas [1] will contain the first capturing parenthesis of your regex and so on...
     *
     * @example
     * // file.js
     * import img from './customer01/file.png';
     *
     * // webpack.config.js
     * module.exports = {
     *   module: {
     *     rules: [
     *       {
     *         test: /\.(png|jpe?g|gif)$/i,
     *         use: [
     *           {
     *             loader: 'file-loader',
     *             options: {
     *               regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/i,
     *               name: '[1]-[name].[ext]',
     *             },
     *           },
     *         ],
     *       },
     *     ],
     *   },
     * };
     *
     * @default undefined
     */
    regExp?: RegExp;
}
