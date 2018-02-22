import { IStorageBagOptions } from './interfaces';
export declare class StorageMeta implements IStorageBagOptions {
    json: boolean;
    expires: number;
    constructor(options?: IStorageBagOptions);
    merge(options: IStorageBagOptions): this;
    static create(options?: IStorageBagOptions): StorageMeta;
    static fromString(meta: string): StorageMeta;
    toString(): string;
    expiresIn(minutes: number): void;
    isExpired(): boolean;
    canExpire(): boolean;
    isJSON(): boolean;
    setJSON(val: boolean): void;
}
