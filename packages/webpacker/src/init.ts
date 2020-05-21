// called by webpacker constructor
import { Webpacker } from './core/Webpacker';
import { resolve }   from 'path';

export const init = (wp: Webpacker) => {

    wp //.mode(process.env.NODE_ENV ? process.env.NODE_ENV : 'production' as any)
        .context(wp.settings.contextPath)
        .performance.hints(false).end()
        .devtool('#source-map');

    let modules = [ resolve(wp.settings.path, 'node_modules') ];
    if ( wp.settings.workspacesEnabled && wp.settings.path !== wp.settings.workspacesDirectory ) {
        modules.push(resolve(wp.settings.workspacesDirectory, 'node_modules'));
    }


    wp.resolve
        .symlinks(true)
        .extensions.merge([ '.js', '.vue', '.json', '.web.ts', '.ts', '.web.tsx', '.tsx', '.styl', '.less', '.scss', '.stylus', '.css', '.mjs', '.web.js', '.json', '.web.jsx', '.jsx' ]).end()
        .mainFields.merge([ 'module', 'browser', 'main' ]).end() // 'jsnext:main',
        .mainFiles.merge([ 'index', 'index.ts', 'index.tsx' ]).end()
        .modules.merge(modules).end()
        .alias.merge({});

    wp.resolveLoader
        .symlinks(true)
        .modules.merge([ 'node_modules' ]).end()

        .extensions.merge([ '.js', '.json', '.ts' ]).end();


    wp.output
        .path(wp.settings.outputPath)
        .filename('[name]')
        .chunkFilename('[name].[chunkHash]')
        .publicPath('/')
        .libraryTarget('window')
        .library([ '[name]' ] as any)
        .devtoolModuleFilenameTemplate(info => {
            var $filename = 'sources://' + info.resourcePath;
            if ( info.resourcePath.match(/\.vue$/) && ! info.allLoaders.match(/type=script/) ) {
                $filename = 'webpack-generated:///' + info.resourcePath + '?' + info.hash;
            }
            return $filename;
        })
        .devtoolFallbackModuleFilenameTemplate('webpack:///[resource-path]?[hash]');

    wp.externals({
        // 'jquery'                : 'jQuery',
        // 'vue'                   : 'Vue',
        // 'vue-class-component'   : 'VueClassComponent',
        // 'vue-property-decorator': 'vue-property-decorator',
        // 'bootstrap'             : 'jQuery',
    });

    wp.module.set('strictExportPresence', true);

    wp.stats({
        warningsFilter: /export .* was not found in/,
    });

    wp.node.merge({
        dgram        : 'empty',
        fs           : 'empty',
        net          : 'empty',
        tls          : 'empty',
        child_process: 'empty',
        // module       : 'empty',
        // dns          : 'mock',
    });
}
