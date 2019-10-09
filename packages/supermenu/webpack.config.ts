// noinspection ES6UnusedImports
import {loaders, helpers, plugins, presets, rules, Webpacker } from '@radic/webpacker';
import { resolve } from 'path';
import { inspect } from 'util';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const wp   = new Webpacker({
    path       : __dirname,
    contextPath: 'src',
    outputPath : 'dev',
    workspace  : __dirname + '/../../package.json',
    mode,
});

rules.css(wp);

rules.scss(wp, {
    css : { importLoaders: 1 },
    scss: { outputStyle: 'expanded' },
});

loaders.saveContent(wp, 'scss', {
    name: 'css',
    outputPath: resolve(__dirname, '.tmp')
}).before('sass-loader');

rules.images(wp);
rules.fonts(wp);
rules.pug(wp);

// wp.module.rule('babel').test(/\.(js|mjs|jsx)$/).exclude.add(/node_modules/);
wp.module.rule('typescript').test(/\.(ts|tsx)$/).exclude.add(/node_modules/);

rules.typescript(wp, {
    transpileOnly  : true,
    configFile     : resolve(__dirname, 'tsconfig.build.json'),
    compilerOptions: {
        target        : 'es2015' as any,
        module        : 'commonjs' as any,
        sourceMap     : wp.isDev,
        removeComments: false,
    },
});

plugins.friendlyErrors(wp);
plugins.bar(wp);
plugins.define(wp, {});
plugins.html(wp, {
    template: resolve(__dirname, 'index.pug'),
    filename: 'index.html',
    inject  : 'body',
});

// NODE_ENV=development webpack
if ( wp.isDev ) {
}
// NODE_ENV=production webpack --production
if ( wp.isProd ) {
    helpers.replaceStyleLoader(wp, 'css', { publicPath: '/' });
    helpers.replaceStyleLoader(wp, 'scss', { publicPath: '/' });
    plugins.miniCssExtract(wp, {
        filename: 'css/[name].css',
    });
    // helpers.minimizer(wp)
    wp.optimization.minimize(true);
    plugins.bundleAnalyzer(wp);
    wp.cache(false);
}

// NODE_ENV=development webpack-dev-server --hot
if ( wp.isHot ) {
    helpers.devServer(wp);
    helpers.setServerLocation(wp, 'http', 'localhost', 5179);
    wp.devServer
        .contentBase(wp.outPath())
        .overlay(true)
        .clientLogLevel('debug' as any)
        .compress(true)

        .inline(true)
        .watchContentBase(true)
        .hot(true);
}

wp.entry('supermenu').add(resolve(__dirname, 'src/index.ts'));
wp.entry('demo').add(resolve(__dirname, 'src/demo.ts'));

wp.output
    .library('[name]')
    .libraryTarget('window')
    .filename('js/[name].js')
    .chunkFilename('js/[name].chunk.[id].js');


const config = wp.toConfig();

if ( wp.isHot ) {
    config.devServer.writeToDisk = true;
}

export default config;
