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
    workspace: '../../',
});
const defineVars = {
    DEV : !isProd,
    PROD: isProd,
};
presets.VueTS(wp, {
    compiler: 'typescript+babel',
});
plugins.define(wp, defineVars);
plugins.html(wp, {...defineVars});
helpers.devServer(wp);
helpers.setServerLocation(wp, 'http', 'localhost', 9605);

wp.resolve.alias.set('@', resolve(__dirname, 'src'));
wp.resolve.alias.set('#', resolve(__dirname, 'src/components'));
wp.stats('verbose')

wp.entry('main')
    .add(resolve(__dirname, 'src/index.tsx'));

wp.output.filename('[name].js');

const config = wp.toConfig();
export default config;
