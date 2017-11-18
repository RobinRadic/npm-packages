export declare type StorageType = 'local' | 'session' | 'cookie' | string;
export declare class Storage {
    static bags: {
        [name: string]: StorageBag;
    };
    static hasBag(name: string): boolean;
    static createBag(name: string, storageType: StorageType): StorageBag;
    static getBag(name: string): StorageBag;
    static getOrCreateBag(name: string, storageType: StorageType): StorageBag;
    private static make(name, storageType);
    static isSupportedProvider(provider: StorageBag): boolean;
}
export interface IStorageProvider {
    length: number;
    onStoreEvent(callback: Function): any;
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, data: string, expires?: number | Date): void;
    hasItem(key: string): boolean;
    getSize(key: any): string;
}
export interface IStorageBagOptions {
    json?: boolean;
    expires?: number;
}
export declare class StorageMeta implements IStorageBagOptions {
    json: boolean;
    expires: number;
    constructor(options?: IStorageBagOptions);
    merge(options: IStorageBagOptions): this;
    static create(options?: IStorageBagOptions): StorageMeta;
    static fromString(meta: string): StorageMeta;
    toString(): string;
    expiresIn(minutes: number): void;
    isExpired(): boolean;
    canExpire(): boolean;
    isJSON(): boolean;
    setJSON(val: boolean): void;
}
export declare type StorageEvent = 'set' | 'del' | 'clear';
export declare class StorageBag {
    provider: IStorageProvider;
    options: IStorageBagOptions;
    constructor(provider: IStorageProvider, options?: IStorageBagOptions);
    on(event: StorageEvent, callback: Function): void;
    listeners: {
        [event: string]: Function[];
    };
    protected fireEvent(event: StorageEvent, params?: any[]): void;
    get<T extends any>(key: any, defaultReturn?: any, options?: IStorageBagOptions): T;
    set(key: any, val: any, options?: IStorageBagOptions): void;
    has(key: any): boolean;
    /**
     * Delete a value from the storage
     * @param {string|number} key
     */
    del(key: any): void;
    /**
     * Clear the storage, will clean all saved items
     */
    clear(): void;
    /**
     * Get total localstorage size in MB. If key is provided,
     * it will return size in MB only for the corresponding item.
     * @param [key]
     * @returns {string}
     */
    getSize(key: any): string;
}
export declare abstract class BaseStorageProvider {
    name: string;
    constructor(name: string);
}
export declare class LocalStorage extends BaseStorageProvider implements IStorageProvider {
    hasItem(key: string): boolean;
    readonly length: number;
    getSize(key: any): string;
    onStoreEvent(callback: Function): void;
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
export declare class SessionStorage extends BaseStorageProvider implements IStorageProvider {
    hasItem(key: string): boolean;
    readonly length: number;
    getSize(key: any): string;
    onStoreEvent(callback: Function): void;
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
export declare class CookieStorage extends BaseStorageProvider implements IStorageProvider {
    readonly length: number;
    getSize(key: any): string;
    cookieRegistry: any[];
    protected listenCookieChange(cookieName: any, callback: any): void;
    onStoreEvent(callback: Function): void;
    clear(): void;
    key(index: number): string;
    getItem(sKey: any): string;
    setItem(sKey: any, sValue: any, vEnd?: any, sPath?: any, sDomain?: any, bSecure?: any): void;
    removeItem(key: string, sPath?: any, sDomain?: any): boolean;
    hasItem(sKey: any): boolean;
    keys(): string[];
}
