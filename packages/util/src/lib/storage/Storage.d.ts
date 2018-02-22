import { StorageType } from './interfaces';
import { StorageBag } from './StorageBag';
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
