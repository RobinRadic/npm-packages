import { StorageMeta } from './StorageMeta';
import { IStorageBagOptions, IStorageProvider, StorageEvent } from './interfaces';

export class StorageBag {
    provider: IStorageProvider;
    options: IStorageBagOptions = {
        json   : true,
        expires: null
    }

    constructor(provider: IStorageProvider, options: IStorageBagOptions = {}) {
        this.provider = provider;
        this.options  = { ...this.options, ...options };
    }

    on(event: StorageEvent, callback: Function) {
        this.listeners[ event ].push(callback);
    }

    listeners: { [event: string]: Function[] } = { set: [], del: [], clear: [] }

    protected fireEvent(event: StorageEvent, params: any[] = []) {
        this.listeners[ event ].forEach(listener => listener.apply(this, params));
    }

    get<T extends any>(key: any, defaultReturn: any = null, options: IStorageBagOptions = {}): T {
        if ( ! this.has(key) ) {
            return defaultReturn;
        }
        const meta = StorageMeta.fromString(this.provider.getItem(key + ':meta'));
        if ( meta.canExpire() && meta.isExpired() ) {
            this.del(key);
            return defaultReturn;
        }

        let val = this.provider.getItem(key);
        if ( meta.isJSON() ) {
            val = JSON.parse(val);
        }
        return <T> val;
    }

    set(key: any, val: any, options: IStorageBagOptions = {}) {
        const meta = StorageMeta.create(this.options).merge(options);
        if ( meta.isJSON() ) {
            val = JSON.stringify(val);
        }
        this.provider.setItem(key + ':meta', meta.toString());
        this.provider.setItem(key, val);
        this.fireEvent('set', [ key, val, meta ]);
    }

    has(key) {
        return this.provider.hasItem(key);
    }


    /**
     * Delete a value from the storage
     * @param {string|number} key
     */
    del(key) {
        this.provider.removeItem(key);
        this.provider.removeItem(key + ':meta');
        this.fireEvent('del', [ key ]);
    }

    /**
     * Clear the storage, will clean all saved items
     */
    clear() {
        this.provider.clear();
        this.fireEvent('clear');
    }


    /**
     * Get total localstorage size in MB. If key is provided,
     * it will return size in MB only for the corresponding item.
     * @param [key]
     * @returns {string}
     */
    getSize(key: any): string {
        return this.provider.getSize(key);
    }
}

