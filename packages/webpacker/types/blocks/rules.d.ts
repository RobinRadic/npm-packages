import { Webpacker } from '../core/Webpacker';
import { BabelLoaderOptions, CacheLoaderOptions, CssLoaderOptions, ExposeLoaderOptions, FileLoaderOptions, PugLoaderOptions, SassLoaderOptions, StyleLoaderOptions, StylusLoaderOptions, ThreadLoaderOptions } from '../interfaces';
import { Options as TypescriptLoaderOptions } from 'ts-loader';
import { VueLoaderOptions } from 'vue-loader';
import { Options as TsImportOptions } from 'ts-import-plugin/lib/index';
export declare const images: import("../interfaces").RuleDefinitionBlockFunction<FileLoaderOptions>;
export declare const fonts: import("../interfaces").RuleDefinitionBlockFunction<FileLoaderOptions>;
export declare const css: import("../interfaces").RuleDefinitionBlockFunction<{
    style?: StyleLoaderOptions;
    css?: CssLoaderOptions;
}>;
export declare const scss: import("../interfaces").RuleDefinitionBlockFunction<{
    style?: StyleLoaderOptions;
    css?: CssLoaderOptions;
    scss?: SassLoaderOptions;
}>;
export declare const stylus: import("../interfaces").RuleDefinitionBlockFunction<{
    style?: StyleLoaderOptions;
    css?: CssLoaderOptions;
    stylus?: StylusLoaderOptions;
}>;
export declare const sourceMaps: import("../interfaces").RuleDefinitionBlockFunction<any>;
export declare const addSourceMapIncludes: ((wp: Webpacker, includes: any[]) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const vue: import("../interfaces").RuleDefinitionBlockFunction<VueLoaderOptions>;
export declare const pug: import("../interfaces").RuleDefinitionBlockFunction<PugLoaderOptions>;
export declare const expose: import("../interfaces").RuleDefinitionBlockFunction<ExposeLoaderOptions>;
export declare const thread: import("../interfaces").RuleDefinitionBlockFunction<ThreadLoaderOptions>;
export declare const cache: import("../interfaces").RuleDefinitionBlockFunction<CacheLoaderOptions>;
export declare const babel: import("../interfaces").RuleDefinitionBlockFunction<BabelLoaderOptions>;
export declare const babelImport: ((wp: Webpacker, _options: Partial<TsImportOptions> | Array<Partial<TsImportOptions>>, ruleName?: any) => import("webpack-chain").Use<import("webpack-chain").Rule<import("webpack-chain").Module>>) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const babelImportPresets: {
    lodash: {
        libraryName: string;
        libraryDirectory: any;
        camel2DashComponentName: boolean;
    };
};
export declare const typescript: import("../interfaces").RuleDefinitionBlockFunction<Partial<TypescriptLoaderOptions>>;
export declare const typescriptImport: ((wp: Webpacker, importOptions?: Partial<TsImportOptions> | Array<Partial<TsImportOptions>>, ruleName?: any) => import("webpack-chain").Use<import("webpack-chain").Rule<import("webpack-chain").Module>>) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export declare const typescriptImportPresets: {
    lodash: {
        libraryName: string;
        libraryDirectory: any;
        camel2DashComponentName: boolean;
    };
    elementUI: {
        libraryName: string;
        libraryDirectory: string;
        camel2DashComponentName: boolean;
        style: (path: string) => string;
    };
};
