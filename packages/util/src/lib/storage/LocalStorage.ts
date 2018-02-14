import { BaseStorageProvider } from './BaseStorageProvider';
import { IStorageProvider } from './interfaces';

export class LocalStorage extends BaseStorageProvider implements IStorageProvider {
    hasItem(key: string): boolean {
        return window.localStorage.getItem(key) !== null;
    }

    get length(): number {
        return window.localStorage.length;
    }

    getSize(key: any): string {
        key = key || false;
        if ( key ) {
            return ((window.localStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        }
        else {
            var total = 0;
            for ( var x in window.localStorage ) {
                total += (window.localStorage[ x ].length * 2) / 1024 / 1024;
            }
            return total.toFixed(2);
        }
    }

    onStoreEvent(callback: Function) {
        if ( window.addEventListener ) {
            window.addEventListener("storage", <any> callback, false);
        }
        else {
            window[ 'attachEvent' ]("onstorage", <any> callback);
        }
    }

    clear(): void {
        window.localStorage.clear();
    }

    getItem(key: string): any {
        return window.localStorage.getItem(key);
    }

    key(index: number): string {
        return window.localStorage.key(index);
    }

    removeItem(key: string): void {
        window.localStorage.removeItem(key);
    }

    setItem(key: string, data: string): void {
        window.localStorage.setItem(key, data);
    }
}
