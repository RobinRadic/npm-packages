import { Webpacker } from '../core/Webpacker';
export interface PresetOptions {
}
export declare const common: ((wp: Webpacker) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export interface ReactTSPresetOptions extends PresetOptions {
    compiler?: 'typescript' | 'typescript+babel';
    srcPath: string;
    cache?: boolean;
    tsconfig?: string;
}
export declare const ReactTS: ((wp: Webpacker, options?: ReactTSPresetOptions) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export interface VueTSPresetOptions extends PresetOptions {
    compiler?: 'typescript' | 'typescript+babel';
    cache?: boolean;
    tsconfig?: string;
}
export declare const VueTS: ((wp: Webpacker, options?: VueTSPresetOptions) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
export interface NodeTSPresetOptions extends PresetOptions {
}
export declare const NodeTS: ((wp: Webpacker, options?: NodeTSPresetOptions) => void) & {
    hooks?: {
        params: import("tapable").SyncWaterfallHook<any[], any, any>;
    };
};
