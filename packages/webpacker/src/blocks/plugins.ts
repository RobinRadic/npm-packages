import { Webpacker } from '../Webpacker';
import { Options as BarOptions } from 'webpackbar';
import { Options as FriendlyErrorsOptions } from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin, { PluginOptions as MiniCssExtractOptions } from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { DefinePlugin, LoaderOptionsPlugin } from 'webpack';
import { Options as CleanOptions } from 'clean-webpack-plugin';
import { Options as OptimizeCssAssetsOptions } from 'optimize-css-assets-webpack-plugin';
import { Options as HtmlOptions } from 'html-webpack-plugin';
import JsonPlugin from '../plugins/JsonPlugin';
import ScssVariableToTypescript from '../plugins/scss-variables-to-typescript';
import { ExtraTemplatedPathsPlugin } from '../plugins/ExtraTemplatedPathsPlugin';

export const loaderOptions       = Webpacker.plugin('loaderOptions', (w, p) => ([ LoaderOptionsPlugin ]));
export const copy                = Webpacker.plugin('copy', (w, p) => ([ 'copy-webpack-plugin', {}, p.depends('copy-webpack-plugin') ]));
export const favicon             = Webpacker.plugin('favicon', (w, p) => ([ 'webapp-webpack-plugin', {}, p.depends('webapp-webpack-plugin') ]));
export const scss2ts             = Webpacker.plugin<ScssVariableToTypescript.Options>('scss2ts', (w, p) => [ resolve(__dirname, '../plugins/scss-variables-to-typescript'), {} ]);
export const json                = Webpacker.plugin<JsonPlugin.Options>('json', (w, p) => ([ resolve(__dirname, '../plugins/JsonPlugin'), {} ]));
export const extraTemplatedPaths = Webpacker.plugin<ExtraTemplatedPathsPlugin.Options>('extra-templated-paths', (w, p) => ([ resolve(__dirname, '../plugins/ExtraTemplatedPathsPlugin.ts'), {} ]));
export const size                = Webpacker.plugin('size', (w, p) => ([ resolve(__dirname, '../plugins/SizePlugin'), {}, p.depends('@@pretty-bytes', '@@gzip-size') ]));
export const vueLoader           = Webpacker.plugin('vueLoader', (w, p) => ([ 'vue-loader/lib/plugin', {}, p.depends('vue-loader', 'vue-template-compiler') ]));
export const bar                 = Webpacker.plugin<BarOptions>('bar', (w, p) => ([ 'webpackbar', {
    profile   : true,
    compiledIn: true,
    minimal   : false,
}, p.depends('@@webpackbar') ]));
export const friendlyErrors      = Webpacker.plugin<FriendlyErrorsOptions>('friendlyErrors', (w, p) => ([ 'friendly-errors-webpack-plugin', {
    compilationSuccessInfo: { messages: [ 'Build success' ], notes: [] },
    onErrors              : function (severity, errors) {
        console.error(severity, errors);
    },
    clearConsole          : false,
    additionalFormatters  : [],
    additionalTransformers: [],
}, p.depends('@@friendly-errors-webpack-plugin') ]));
export const bundleAnalyzer      = Webpacker.plugin<BundleAnalyzerPlugin.Options>('analyzer', (w, p) => ([ 'webpack-bundle-analyzer/lib/BundleAnalyzerPlugin.js', {
    analyzerMode  : 'static',
    defaultSizes  : 'gzip',
    reportFilename: 'bundle-analyzer.html',
    openAnalyzer  : false,
}, p.depends('@@webpack-bundle-analyzer') ]));
export const miniCssExtract      = Webpacker.plugin<MiniCssExtractOptions>('miniCssExtract', (w, p) => ([ 'mini-css-extract-plugin', {
    filename     : '[name].css',
    chunkFilename: '[name].[id].css',
}, p.depends('@@mini-css-extract-plugin') ]));
export const MiniCssExtract      = MiniCssExtractPlugin;
export const clean               = Webpacker.plugin<CleanOptions>('clean', (w, p) => ([ 'clean-webpack-plugin', {},
    // [ 'js/', 'css/', '*.hot-update.*', 'assets/', 'vendor/' ],
    // { root: w.settings.outputPath, verbose: false },]
    p.depends('clean-webpack-plugin') ]));
export const define              = Webpacker.plugin<any>('define', (w, p) => ([ DefinePlugin, {
    'process.env': {
        NODE_ENV: `"${w.get('mode')}"`,
    },
} ]));
export const html                = Webpacker.plugin<HtmlOptions>('html', (w, p) => ([ 'html-webpack-plugin', {
    filename      : 'index.html',
    template      : resolve(w.settings.path, 'index.html'),
    inject        : 'head',
    chunksSortMode: 'auto', //w.isDev ? 'dependency' : 'auto',
    // templateParameters: {},
}, p.depends('@@html-webpack-plugin') ]));
export const optimizeCssAssets   = Webpacker.plugin<OptimizeCssAssetsOptions>('optimize-css-assets', (w, p) => ([ 'optimize-css-assets-webpack-plugin', {
    assetNameRegExp    : /\.css$/g,
    cssProcessor       : require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint           : true,
}, p.depends('@@optimize-css-assets-webpack-plugin', 'cssnano') ]));
