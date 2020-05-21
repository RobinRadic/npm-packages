import { Webpacker }                                                    from '../core/Webpacker';
import { Options as BarOptions }                                        from 'webpackbar';
import { Options as FriendlyErrorsOptions }                             from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin }                                         from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin, { PluginOptions as MiniCssExtractOptions } from 'mini-css-extract-plugin';
import { resolve }                                                      from 'path';
import { DefinePlugin, LoaderOptionsPlugin }                            from 'webpack';
import { Options as CleanOptions }                                      from 'clean-webpack-plugin';
import { Options as OptimizeCssAssetsOptions }                          from 'optimize-css-assets-webpack-plugin';
import { Options as HtmlOptions }                                       from 'html-webpack-plugin';
import JsonPlugin                                                       from '../plugins/JsonPlugin';
import ScssVariableToTypescriptPlugin                                   from '../plugins/ScssVariableToTypescriptPlugin';
import ExtraTemplatedPathsPlugin                                        from '../plugins/ExtraTemplatedPathsPlugin';
import EntrypointPathPlugin                                             from '../plugins/EntrypointPathPlugin';
import SizePlugin                                                       from '../plugins/SizePlugin';


export const entrypointPath      = Webpacker.definePlugin('entrypoint-path', (w, p) => ([ EntrypointPathPlugin, {} ]));
export const extraTemplatedPaths = Webpacker.definePlugin<ExtraTemplatedPathsPlugin.Options>('extra-templated-paths', (w, p) => ([ ExtraTemplatedPathsPlugin, {} ]));
export const json                = Webpacker.definePlugin<JsonPlugin.Options>('json', (w, p) => ([ JsonPlugin, {} ]));
export const scss2ts             = Webpacker.definePlugin<ScssVariableToTypescriptPlugin.Options>('scss2ts', (w, p) => [ ScssVariableToTypescriptPlugin, {} ]);
export const size                = Webpacker.definePlugin('size', (w, p) => ([ SizePlugin, {}, p.depends('@@pretty-bytes', '@@gzip-size') ]));


export const loaderOptions     = Webpacker.definePlugin('loaderOptions', (w, p) => ([ LoaderOptionsPlugin ]));
export const copy              = Webpacker.definePlugin('copy', (w, p) => ([ 'copy-webpack-plugin', {}, p.depends('copy-webpack-plugin') ]));
export const favicon           = Webpacker.definePlugin('favicon', (w, p) => ([ 'webapp-webpack-plugin', {}, p.depends('webapp-webpack-plugin') ]));
export const vueLoader         = Webpacker.definePlugin('vueLoader', (w, p) => ([ 'vue-loader/lib/plugin', {}, p.depends('vue-loader', 'vue-template-compiler') ]));
export const bar               = Webpacker.definePlugin<BarOptions>('bar', (w, p) => ([ 'webpackbar', {
    profile   : true,
    compiledIn: true,
    minimal   : false,
}, p.depends('@@webpackbar') ]));
export const friendlyErrors    = Webpacker.definePlugin<FriendlyErrorsOptions>('friendlyErrors', (w, p) => ([ 'friendly-errors-webpack-plugin', {
    compilationSuccessInfo: { messages: [ 'Build success' ], notes: [] },
    onErrors              : function (severity, errors) {
        console.error(severity, errors);
    },
    clearConsole          : false,
    additionalFormatters  : [],
    additionalTransformers: [],
}, p.depends('@@friendly-errors-webpack-plugin') ]));
export const bundleAnalyzer    = Webpacker.definePlugin<BundleAnalyzerPlugin.Options>('analyzer', (w, p) => ([ 'webpack-bundle-analyzer/lib/BundleAnalyzerPlugin.js', {
    analyzerMode  : 'static',
    defaultSizes  : 'gzip',
    reportFilename: 'bundle-analyzer.html',
    openAnalyzer  : false,
}, p.depends('@@webpack-bundle-analyzer') ]));
export const miniCssExtract    = Webpacker.definePlugin<MiniCssExtractOptions>('miniCssExtract', (w, p) => ([ 'mini-css-extract-plugin', {
    filename     : '[name].css',
    chunkFilename: '[name].[id].css',
}, p.depends('@@mini-css-extract-plugin') ]));
export const MiniCssExtract    = MiniCssExtractPlugin;
export const clean             = Webpacker.definePlugin<CleanOptions>('clean', (w, p) => ([ 'clean-webpack-plugin', {},
    // [ 'js/', 'css/', '*.hot-update.*', 'assets/', 'vendor/' ],
    // { root: w.settings.outputPath, verbose: false },]
    p.depends('clean-webpack-plugin') ]));
export const define            = Webpacker.definePlugin<any>('define', (w, p) => ([ DefinePlugin, {
    'process.env': {
        NODE_ENV: `"${w.get('mode')}"`,
    },
} ]));
export const html              = Webpacker.definePlugin<HtmlOptions>('html', (w, p) => ([ 'html-webpack-plugin', {
    filename      : 'index.html',
    template      : resolve(w.settings.path, 'index.html'),
    inject        : 'head',
    chunksSortMode: 'auto', //w.isDev ? 'dependency' : 'auto',
    // templateParameters: {},
}, p.depends('@@html-webpack-plugin') ]));
export const optimizeCssAssets = Webpacker.definePlugin<OptimizeCssAssetsOptions>('optimize-css-assets', (w, p) => ([ 'optimize-css-assets-webpack-plugin', {
    assetNameRegExp    : /\.css$/g,
    cssProcessor       : require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint           : true,
}, p.depends('@@optimize-css-assets-webpack-plugin', 'cssnano') ]));

