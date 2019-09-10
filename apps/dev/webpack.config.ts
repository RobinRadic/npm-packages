import { typescriptImportPresets } from '@radic/webpacker/lib/blocks/rules';
import { resolve } from 'path';
import { blocks, Webpacker } from '@radic/webpacker';
import { loader } from 'webpack';

Error.stackTraceLimit = Infinity;

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
rules.typescript(wp, {
    transpileOnly: true,
});

rules.typescriptImport(wp, [
    typescriptImportPresets.lodash,
    {
        libraryName     : '@radic/util',
        libraryDirectory: 'lib',
    },
]);
plugins.define(wp, defineVars);
plugins.bar(wp);
plugins.bundleAnalyzer(wp);
plugins.size(wp);
wp.stats('verbose')
wp.module.rule('typescript')
    .use('ts-loader')
    .after('ts-loader')
    .loader(resolve(__dirname, 'loader.ts'));

wp.entry('main')
    .add(resolve(__dirname, 'src/index.ts'));
wp.output.filename('[name].js');

const config             = wp.toConfig();

export default config;
