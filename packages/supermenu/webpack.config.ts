// noinspection ES6UnusedImports
import { helpers, plugins, presets, rules, Webpacker } from '@radic/webpacker';
import { resolve } from 'path';

const wp = new Webpacker({
    path       : __dirname,
    contextPath: 'src',
    outputPath : 'dev',
    workspace  : __dirname + '/../../package.json',
    mode       : process.env.NODE_ENV === 'production' ? 'production' : 'development',
});

rules.css(wp);
rules.scss(wp, {
    scss: { outputStyle: 'expanded' },
});
rules.images(wp);
rules.fonts(wp);


// wp.module.rule('babel').test(/\.(js|mjs|jsx)$/).exclude.add(/node_modules/);
wp.module.rule('typescript').test(/\.(ts|tsx)$/).exclude.add(/node_modules/);

rules.typescript(wp, {
    transpileOnly  : true,
    configFile     : resolve(__dirname, 'tsconfig.build.json'),
    compilerOptions: {
        target        : 'es5' as any,
        module        : 'commonjs' as any,
        sourceMap     : wp.isDev,
        removeComments: false,
    },
});

plugins.friendlyErrors(wp);
plugins.bar(wp);
plugins.define(wp, {});
plugins.html(wp, {
    template: resolve(__dirname, 'index.html'),
    filename: 'index.html',
    inject  : 'head',
});



if ( wp.isDev ) {

}
if ( wp.isProd ) {

}
if ( wp.isHot ) {
    helpers.devServer(wp);
    helpers.setServerLocation(wp, 'http', 'localhost', 5179);
    wp.devServer
        .contentBase(wp.outPath())
        .overlay(true)
        .clientLogLevel('debug' as any)
        .compress(true)
        .inline(true)
        .hot(true);
}
wp.entry('supermenu').add(resolve(__dirname, 'src/index.ts'));
wp.entry('demo').add(resolve(__dirname, 'scss/demo.scss'));

wp.output
    .library('[name]')
    .libraryTarget('window')
    .filename('js/[name].js')
    .chunkFilename('js/[name].chunk.[id].js')


const config = wp.toConfig();

if(wp.isHot){
    config.devServer.writeToDisk=true;
}

export default config;
