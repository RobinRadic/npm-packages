import { IStorageProvider } from './interfaces';
import { BaseStorageProvider } from './BaseStorageProvider';
export declare class CookieStorage extends BaseStorageProvider implements IStorageProvider {
    readonly length: any;
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
    keys(): any;
}
