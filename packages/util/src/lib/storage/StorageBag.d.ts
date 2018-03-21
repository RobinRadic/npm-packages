import { IStorageBagOptions, IStorageProvider, StorageEvent } from './interfaces';
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
