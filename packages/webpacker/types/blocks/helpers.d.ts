/// <reference types="webpack" />
import { Webpacker } from '../core/Webpacker';
import { TerserPluginOptions } from 'terser-webpack-plugin';
import { Rule } from 'webpack-chain';
import { SpeedMeasureOptions } from '../interfaces';
export declare const devServer: ((wp: Webpacker) => any) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const setServerLocation: ((wp: Webpacker, protocol: 'http' | 'https', host?: any, port?: number) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const minimizer: ((wp: Webpacker, options?: TerserPluginOptions) => import("webpack-chain").Plugin<import("webpack-chain").Optimization & {
    store: import("../core/Webpacker").Mapper<"optimization", import("webpack").Options.Optimization>;
}, import("webpack").Plugin>) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const replaceStyleLoader: ((wp: Webpacker, rule: string | Rule, options?: any, loader?: string) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const speedMeasure: ((wp: Webpacker, options?: SpeedMeasureOptions, addAsConfigWrapper?: boolean) => any) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
