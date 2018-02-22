import { IStorageProvider } from './interfaces';
import { BaseStorageProvider } from './BaseStorageProvider';
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
