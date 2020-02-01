import {rollup, RollupOptions }                       from 'rollup';
import { IOptions }                                    from 'rollup-plugin-typescript2/dist/ioptions';
import cleanup                                         from 'rollup-plugin-cleanup';
// noinspection ES6UnusedImports
import commonjs, { RollupCommonJSOptions }             from 'rollup-plugin-commonjs';
// noinspection ES6UnusedImports
import copy, { CopyOptions }                           from 'rollup-plugin-copy';
// noinspection ES6UnusedImports
import node_resolve, { Options as NodeResolveOptions } from 'rollup-plugin-node-resolve';
// noinspection ES6UnusedImports
import terser, { Options as TerserOptions }            from 'rollup-plugin-terser';
// noinspection ES6UnusedImports
import vue, { VuePluginOptions }                       from 'rollup-plugin-vue';
import { CompilerOptions }                             from 'typescript';
import typescript                                      from 'rollup-plugin-typescript2';
import { merge }                                       from 'lodash';


type TypescriptPluginCompilerOptionsOptions = Omit<CompilerOptions,'target'> & {
    target?:
        'es3' | // 'ES3'
        'es5' | // 'ES5'
        'es2015' | // 'ES2015'
        'es2016' | // 'ES2016'
        'es2017' | // 'ES2017'
        'es2018' | // 'ES2018'
        'es2019' | // 'ES2019'
        'es2020' | // 'ES2020'
        'esnext' | // 'ESNext'
        'json' | // 'JSON'
        'latest' // 'Latest'
    module?:
        'none' |// 'None'
        'commonjs' |// 'CommonJS'
        'amd' |// 'AMD'
        'umd' |// 'UMD'
        'system' |// 'System'
        'es2015' |// 'ES2015'
        'esnext' // 'ESNext'
    jsx?:
        'none' |
        'preserve' |
        'react' |
        'react-native'
}

interface TypescriptPluginOptions extends Partial<IOptions> {
    tsconfigOverride?: {
        [ k: string ]: any
        compilerOptions?: TypescriptPluginCompilerOptionsOptions
    }
    tsconfigDefaults?: {
        [ k: string ]: any
        compilerOptions?: TypescriptPluginCompilerOptionsOptions
    }
}

interface DefaultPluginOptions {
    cleanup?: cleanup.Options
    typescript?: TypescriptPluginOptions
    commonjs?: RollupCommonJSOptions
    copy?: CopyOptions
    nodeResolve?: NodeResolveOptions
    terser?: TerserOptions
    vue?: VuePluginOptions
}

export interface DefaultRollupOptions extends Omit<RollupOptions, 'plugins'> {
    plugins?: DefaultPluginOptions
}

const defaultOptions: DefaultRollupOptions = {
    input  : './src/index.ts',
    plugins: {
        cleanup   : {
            include: [ './lib' ],
        },
        typescript: {
            tsconfig        : './tsconfig.build.json',
            tsconfigOverride: {},
        },
    },
};

export function createOptionsFromDefaults(options: DefaultRollupOptions, plugins = {}): RollupOptions {
    plugins                          = { cleanup, typescript, commonjs, copy, node_resolve, terser, vue, ...plugins };
    let rollupOptions: RollupOptions = merge({}, defaultOptions, options) as RollupOptions;
    rollupOptions.plugins            = Object.getOwnPropertyNames(options.plugins).map(pluginName => {
        return plugins[ pluginName ](options.plugins[ pluginName ]);
    });
    return rollupOptions;
}

export async function buildNode() {}

export async function buildUMD() {}

export async function buildES6() {
    return rollup(
        createOptionsFromDefaults({
            plugins: {
                typescript: {
                    tsconfigOverride: {
                        compilerOptions: {
                            target: 'es2016',
                            module: 'esnext'
                        },
                    },
                },
            },
            output : [
                { esModule: true },
            ],
        }),
    );
}

export async function buildDTS() {}


export async function build() {
    await buildES6()
}


build();
