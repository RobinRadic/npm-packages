
import { IStorageProvider, StorageType,StorageEvent } from './interfaces';
import { StorageBag } from './StorageBag';
import { CookieStorage } from './CookieStorage';
import { LocalStorage } from './LocalStorage';
import { SessionStorage } from './SessionStorage';

export class Storage {
    static bags: { [name: string]: StorageBag } = {}

    static hasBag(name: string): boolean {
        return typeof Storage.bags[ name ] !== 'undefined';
    }

    static createBag(name: string, storageType: StorageType): StorageBag {
        if ( Storage.hasBag(name) ) {
            throw new Error('StorageBag ' + name + ' already exists');
        }
        return Storage.bags[ name ] = new StorageBag(Storage.make(name, storageType));
    }

    static getBag(name: string): StorageBag {
        if ( ! Storage.hasBag(name) ) {
            throw new Error('StorageBag ' + name + ' does not exist');
        }
        return Storage.bags[ name ];
    }

    static getOrCreateBag(name: string, storageType: StorageType): StorageBag {
        if ( ! Storage.hasBag(name) ) {
            return Storage.createBag(name, storageType);
        }
        return Storage.getBag(name);
    }

    private static make(name: string, storageType: StorageType): IStorageProvider {
        if ( storageType === 'cookie' ) return new CookieStorage(name);
        if ( storageType === 'local' ) return new LocalStorage(name);
        if ( storageType === 'session' ) return new SessionStorage(name);
        throw new Error('Storage provider could not be maked. ... ?')
    }

    static isSupportedProvider(provider: StorageBag): boolean {
        if ( provider instanceof LocalStorage ) {
            return window.localStorage !== undefined
        }
        if ( provider instanceof SessionStorage ) {
            return window.localStorage !== undefined
        }
        if ( provider instanceof CookieStorage ) {
            return window.document.cookie !== undefined
        }
    }
}
