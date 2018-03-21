import { Config, IConfig, IConfigProperty } from "@radic/util";
export interface RConfig extends IConfigProperty {
    save(): this;
    load(): this;
    lock(): this;
    unlock(): this;
    isLocked(): boolean;
    reset(): this;
}
export declare class ConfigCrypto {
    protected secretKey: string;
    protected generateSecretKey(): string;
    protected hasGeneratedSecretKey(): boolean;
    protected getSecretKey(): string;
    encrypt(message: string): string;
    decrypt(ciphertext: string): string;
}
export declare class ConfigBackupStore {
    crypto: ConfigCrypto;
    create(data: any, encrypt?: boolean): string;
    all(): string[];
    get(id: string, decrypt?: boolean): any;
    protected createUniqueFilePath(encrypt?: boolean): string;
}
export declare class PersistentFileConfig extends Config {
    protected filePath: string;
    useCrypto: boolean;
    protected autoload: boolean;
    protected autoloadEnv: boolean;
    crypto: ConfigCrypto;
    backups: ConfigBackupStore;
    isLoaded: boolean;
    defaultConfig: Object;
    protected saveEnabled: boolean;
    constructor(obj: Object, filePath?: string, useCrypto?: boolean, autoload?: boolean, autoloadEnv?: boolean);
    protected tryAutoload(): void;
    has(prop?: any): boolean;
    raw(prop?: any): any;
    get<T extends any>(prop?: any, defaultReturnValue?: any): T;
    set(prop: string, value: any): IConfig;
    unset(prop: any): any;
    merge(...args: any[]): this;
    save(): this;
    protected isDebug(): boolean;
    load(): this;
    lock(): this;
    unlock(): this;
    isLocked(): boolean;
    reset(): this;
    backup(encrypt?: boolean): string;
    backupWithEncryption(): string;
    backupWithoutEncryption(): string;
    restore(id: string, decrypt?: boolean): this;
    getBackupIds(): string[];
    protected loadEnv(): this;
    static makeProperty(config: PersistentFileConfig): RConfig;
}
export declare type RCFileKey = 'directory' | 'prefix';
export interface RCFileConfig {
    directory?: string;
    prefix?: string;
}
export declare class RCFile {
    protected config: PersistentFileConfig;
    constructor();
    reset(): this;
    set(key: RCFileKey, value: string): this;
    unset(key: RCFileKey): this;
    get(key: RCFileKey, defaultValue?: string): string;
    reload(): void;
}
export declare const config: RConfig;
