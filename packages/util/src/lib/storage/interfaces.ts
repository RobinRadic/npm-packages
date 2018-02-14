
export type StorageType = 'local' | 'session' | 'cookie' | string;
export type StorageEvent = 'set' | 'del' | 'clear'
export interface IStorageProvider {
    length: number;

    onStoreEvent(callback: Function);

    clear(): void;

    getItem(key: string): any;

    key(index: number): string;

    removeItem(key: string): void;

    setItem(key: string, data: string, expires?: number | Date): void;

    hasItem(key: string): boolean;

    getSize(key: any): string;
}
export interface IStorageBagOptions {
    json?: boolean,
    expires?: number
}
