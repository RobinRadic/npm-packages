import { PersistentFileConfig } from "./config";
import { IConfig } from "@radic/util";
export interface ICache extends IConfig {
    set(prop: string, value: any, expires?: number): any;
}
export declare class Cache extends PersistentFileConfig implements ICache {
    expires: number;
    config: IConfig;
    constructor();
    protected isDebug(): boolean;
    set(prop: string, value: any, expires?: number): ICache;
    get<T extends any>(prop?: any, defaultReturnValue?: ((res: any, rej: any) => Promise<T> | T) | any, expires?: number): T;
    has(prop?: any): boolean;
    save(): this;
    load(): this;
}
