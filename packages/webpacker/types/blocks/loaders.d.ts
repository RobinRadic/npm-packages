import { Webpacker } from '../core/Webpacker';
import { Rule } from 'webpack-chain';
import { SaveContentLoaderOptions } from '../loaders/save-content-loader';
export declare const saveContent: ((wp: Webpacker, rule: string | Rule, options: SaveContentLoaderOptions) => import("webpack-chain").Use<Rule<import("webpack-chain").Module>>) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
