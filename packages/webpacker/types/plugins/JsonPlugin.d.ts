import { Compiler, Stats } from 'webpack';
import { SyncWaterfallHook } from 'tapable';
declare const webpackJson: {
    filePath: string;
    ensureRemoved: () => void;
    write: (data: object) => void;
};
declare const _do: DataObject;
export declare namespace JsonPlugin {
    interface Options {
        filePath?: string;
        data?: any;
        transformer?: (jsonData: any, data: typeof _do & Record<string, any>) => any;
        done?: (jsonData: any, data: typeof _do & Record<string, any>, stats: Stats) => any;
        remove?: boolean;
    }
    interface DataObject {
        _data: {};
        get<T>(path: any, def?: any): any;
        set(path: any, value: any): any;
        push(path: any, value: any): any;
        getData(): any;
    }
}
export declare class JsonPlugin {
    protected options: JsonPlugin.Options;
    static webpackJson: typeof webpackJson;
    protected webpackJson: typeof webpackJson;
    readonly hooks: {
        addToDataName: SyncWaterfallHook<string, any, any>;
        addScriptsToData: SyncWaterfallHook<string[], JsonPlugin.DataObject, any>;
        addStylesToData: SyncWaterfallHook<string[], JsonPlugin.DataObject, any>;
    };
    constructor(options?: JsonPlugin.Options);
    apply(compiler: Compiler): void;
}
export default JsonPlugin;
