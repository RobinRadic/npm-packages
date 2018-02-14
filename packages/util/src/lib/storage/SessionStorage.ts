import { IStorageProvider } from './interfaces';
import { BaseStorageProvider } from './BaseStorageProvider';

export class SessionStorage extends BaseStorageProvider implements IStorageProvider {

    hasItem(key: string): boolean {
        return window.sessionStorage.getItem(key) !== null;
    }

    get length() {
        return window.sessionStorage.length;
    }

    getSize(key: any): string {
        key = key || false;
        if ( key ) {
            return ((window.sessionStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        }
        else {
            var total = 0;
            for ( var x in window.sessionStorage ) {
                total += (window.sessionStorage[ x ].length * 2) / 1024 / 1024;
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
        window.sessionStorage.clear();
    }

    getItem(key: string): any {
        return window.sessionStorage.getItem(key);
    }

    key(index: number): string {
        return window.sessionStorage.key(index);
    }

    removeItem(key: string): void {
        window.sessionStorage.removeItem(key);
    }

    setItem(key: string, data: string): void {
        window.sessionStorage.setItem(key, data);
    }
}
