import { Webpacker } from '../Webpacker';
import * as plugins from './plugins';
import * as rules from './rules';
import { BabelLoaderOptions } from '../interfaces';

export interface PresetOptions {}


export const common = Webpacker.wrap((wp: Webpacker) => {
    wp.depends(...[
        '!classnames',
        '@types/debug',
        '@types/classnames',
        'debug',
        '@babel/core',
        'core-js',
    ]);
    rules.css(wp);
    rules.scss(wp);
    rules.images(wp);
    rules.fonts(wp);
    rules.sourceMaps(wp);
    plugins.friendlyErrors(wp);
    plugins.bar(wp);
});


export interface ReactTSPresetOptions extends PresetOptions {
    compiler?: 'typescript' | 'typescript+babel'
    srcPath: string
    cache?: boolean
    tsconfig?: string
}

export const ReactTS = Webpacker.wrap((wp: Webpacker, options: ReactTSPresetOptions = {} as any) => {
    common(wp);
    let defaults: Partial<ReactTSPresetOptions> = {
        cache   : true,
        compiler: 'typescript+babel',
        tsconfig: 'tsconfig.json',
    };
    options                                     = { ...defaults, ...options };
    wp.settings.preset                          = 'ReactTS';
    wp.settings.presetOptions                   = options;

    wp.depends(...[
        '!react', '!react-dom', '!mobx', '!mobx-react', '!mobx-utils', '!prop-types',
        '@types/react', '@types/react-dom', '@types/prop-types', '@hot-loader/react-dom',
        'react-hot-loader',
        'react-dev-utils',
        'babel-preset-react-app',
        'babel-plugin-jsx-control-statements',
    ]);

    const babelOptions = {
        babelrc       : false,
        configFile    : false,
        cacheDirectory: options.cache,
        compact       : wp.isProd,
        'sourceMaps'  : wp.settings.sourceMap,
        presets       : [
            [ 'react-app' ],
        ],
        plugins       : [
            'jsx-control-statements',
        ],
    };

    wp.module.rule('babel').test(/\.(js|mjs|jsx)$/);
    rules.babel(wp, babelOptions, 'babel');

    if ( options.compiler === 'typescript+babel' ) {
        wp.module.rule('typescript').test(/\.(ts|tsx)$/);
        rules.babel(wp, babelOptions, 'typescript');
        rules.typescript(wp, {
            configFile     : options.tsconfig,
            transpileOnly  : true,
            compilerOptions: {
                target   : 'es6' as any,
                module   : 'esnext' as any,
                sourceMap: wp.settings.sourceMap,
                // jsx       : 'preserve' as any,
                // jsxFactory: 'h',
            },
        }, 'typescript');
    }

    wp.$on('toConfig', () => {
        if ( wp.settings.get('hmr', false) ) {
            wp.resolve.alias.set('react-dom', '@hot-loader/react-dom');
            wp.module.rule('typescript').use('babel-loader').tap((o: BabelLoaderOptions) => {
                o.plugins.push('react-hot-loader/babel');
                return o;
            });
        }
    });
});


export interface VueTSPresetOptions extends PresetOptions {
    compiler?: 'typescript' | 'typescript+babel'
    cache?: boolean
    tsconfig?: string
}

export const VueTS = Webpacker.wrap((wp: Webpacker, options: VueTSPresetOptions = {}) => {
    common(wp);
    let defaults: Partial<VueTSPresetOptions> = {
        cache   : true,
        tsconfig: 'tsconfig.json',
    };
    options                                   = { ...defaults, ...options };
    wp.settings.preset                        = 'VueTS';
    wp.settings.presetOptions                 = options;

    const babelOptions = {
        babelrc       : false,
        configFile    : false,
        cacheDirectory: options.cache,
        compact       : wp.isProd,
        'sourceMaps'  : wp.settings.sourceMap,
        presets       : [
            [ '@vue/babel-preset-app' ],
        ],
        plugins       : [],
    };

    wp.module.rule('babel').test(/\.(js|mjs|jsx)$/);
    rules.babel(wp, babelOptions, 'babel');

    if ( options.compiler === 'typescript+babel' ) {
        wp.module.rule('typescript').test(/\.(ts|tsx)$/);
        rules.babel(wp, babelOptions, 'typescript');
        rules.typescript(wp, {
            configFile     : options.tsconfig,
            transpileOnly  : true,
            compilerOptions: {
                target    : 'es6' as any,
                module    : 'esnext' as any,
                sourceMap : wp.settings.sourceMap,
                jsx       : 'preserve' as any,
                jsxFactory: 'h',
            },
        }, 'typescript');
    }

    rules.vue(wp, {});
    plugins.vueLoader(wp);

    wp.depends(...[
        '@vue/babel-preset-app',
        '@vue/babel-helper-vue-jsx-merge-props',
        '!vue',
        'vue-class-component',
        'vue-loader',
        'vue-tsx-support',
        'vue-property-decorator',
        'vue-template-compiler',
    ]);

});


export interface NodeTSPresetOptions extends PresetOptions {}

export const NodeTS = Webpacker.wrap((wp: Webpacker, options: NodeTSPresetOptions = {}) => {
    wp.settings.preset = 'NodeTS';

});


/*
"speed-measure-webpack-plugin": "^1.3.0",
"optimize-css-assets-webpack-plugin": "^5.0.1",
        "postcss-nested": "^4.1.1",
        "postcss-scss
        "postcss-clean": "^1.1.0",
        "postcss-scss": "^2.0.0",
        "html-webpack-plugin": "^3.2.0",
        "cssnano": "^4.1.8",
        "cssnext": "^1.8.4",
        "dotenv": "^6.2.0",
        "cache-loader": "^2.0.1",
        "clean-webpack-plugin": "^1.0.0",
        "commander": "^2.20.0",
        "copy-webpack-plugin": "^4.6.0",
        "@types/webpack-env": "^1.13.6",
        "@types/less": "^3.0.0",
        "@types/clean-webpack-plugin": "^0.1.2",
        "@types/copy-webpack-plugin": "^4.4.2",
        "@hot-loader/react-dom": "^16.8.4",
        "prop-types": "^15.6.2",
  */
