Error.stackTraceLimit = Infinity;

import { resolve } from 'path';
import { blocks, Webpacker } from '@radic/webpacker';

const { helpers, rules, presets, plugins } = blocks;

const isProd = process.env.NODE_ENV === 'production';
const isHot  = process.argv.includes('--hot');

const wp         = new Webpacker({
    mode     : isProd ? 'production' : 'development',
    path     : __dirname,
    sourceMap: true,
    workspace: '../',
});
const defineVars = {
    DEV : !isProd,
    PROD: isProd,
};
presets.ReactTS(wp, {
    srcPath : 'packages/core',
    compiler: 'typescript+babel',
});
plugins.define(wp, defineVars);
plugins.html(wp, {});
helpers.devServer(wp);
rules.vue(wp);
plugins.vueLoader(wp);
helpers.setServerLocation(wp, 'http', 'localhost', 9605);

wp.resolve.alias.set('@', resolve(__dirname, 'src'));
wp.entry('main')
    .add('react-hot-loader/patch')
    .add(resolve(__dirname, 'src/index.tsx'));
wp.output.filename('[name].js');

const config = wp.toConfig();

export default config;
