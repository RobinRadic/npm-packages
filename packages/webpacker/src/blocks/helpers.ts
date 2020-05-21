import { Webpacker } from '../core/Webpacker';
import morgan        from 'morgan';
import { TerserPluginOptions } from 'terser-webpack-plugin';
import { merge }               from 'lodash';
import { Rule }                from 'webpack-chain';
import MiniCssExtractPlugin    from 'mini-css-extract-plugin';
import { SpeedMeasureOptions } from '../interfaces';
import { inspect }             from 'util';


export const devServer = Webpacker.wrap((wp: Webpacker) => {
    return wp.devServer.depends('@@webpack-dev-server','launch-editor-middleware','morgan')
        .headers({ 'Access-Control-Allow-Origin': '*' })
        .contentBase(__dirname + '/.tmp/out')
        .historyApiFallback(true)
        .noInfo(false)
        .compress(true)
        .quiet(false)
        .host('pycrvs.local')
        .port(8079)
        .disableHostCheck(true)
        .stats('none')
        .before(app => {
            if(require.resolve('morgan')) {
                app.use(require('morgan')('dev', {}));
            }
            if(require.resolve('launch-editor-middleware')) {
                app.use('/__open-in-editor', require('launch-editor-middleware')('idea-php', (fileName, errorMsg)=>{
                    process.stdout.write(inspect({fileName,errorMsg},true, 10, true));
                }))
            }
        });
});

export const setServerLocation = Webpacker.wrap((wp: Webpacker, protocol: 'http' | 'https', host = 'localhost', port: number = 8079) => {
    wp.settings.set('hmr', true);
    wp.devServer
        .host(host)
        .port(port)
        .https(protocol === 'https');
    wp.output
        .publicPath(`${protocol}://${host}:${port}/`);
    // wp.plugin('hmr').use(HotModuleReplacementPlugin, [ {} ]);
});


export const minimizer = Webpacker.wrap((wp: Webpacker, options: TerserPluginOptions = {}) => {
    return wp.optimization
        .minimizer('terser')
        .depends('@@terser', '@@terser-webpack-plugin')
        .use('terser-webpack-plugin', [ <TerserPluginOptions>merge({
            test           : /\.js(\?.*)?$/i,
            extractComments: true,
            terserOptions  : {
                ecma           : undefined,
                warnings       : false,
                parse          : {},
                compress       : {},
                mangle         : true, // Note `mangle.properties` is `false` by default.
                module         : false,
                output         : null,
                toplevel       : false,
                nameCache      : null,
                ie8            : false,
                keep_classnames: undefined,
                keep_fnames    : false,
                safari10       : false,
            },
        }, options) ]);
});



export const replaceStyleLoader = Webpacker.wrap((wp: Webpacker, rule: string | Rule, options: any = {}, loader: string = MiniCssExtractPlugin.loader) => {
    if ( typeof rule === 'string' ) {
        rule = wp.module.rule(rule);
    }
    rule.use('style-loader').loader(loader).options(options);
});


export const speedMeasure = Webpacker.wrap((wp:Webpacker, options:SpeedMeasureOptions={}, addAsConfigWrapper:boolean=true) => {
    wp.depends('speed-measure-webpack-plugin');
    const SMP = require('speed-measure-webpack-plugin');
    const smp = new SMP(options)
    if(addAsConfigWrapper){
        wp.extendConfig(config => smp.wrap(config));
    }
    return smp;
})
