import { INode } from './interfaces';
export declare function collect<T>(items: T[]): Collection<T>;
export declare class Collection<T> extends Array<T> implements Array<T> {
    filter: (callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any) => this;
    constructor(...items: T[]);
    static make<T>(items?: T[]): Collection<T>;
    isEmpty(): boolean;
    IMenuNode: any;
    isNotEmpty(): boolean;
    first(): T;
    last(): T;
    findBy(key: keyof T, value: any): T | undefined;
    where(key: keyof T, value: any): this;
    whereIn(key: keyof T, values: any[]): this;
    whereNotIn(key: keyof T, values: any[]): this;
    each(callbackfn: (value: T, index: number, array: T[]) => void): this;
    newInstance(...items: T[]): this;
    keyBy<K extends keyof T>(key: K | ((item: T) => string)): Record<string, T>;
    mapKeyBy<K extends keyof T>(key: K | ((item: T) => string)): Map<K, T>;
}
export declare class NodeArray<T extends INode = INode> extends Collection<T> {
    item(key: number): T;
    hasItem(key: number): boolean;
    depth(depth: number): this;
    root(): this;
    without(item: any[]): this;
    only(item: any[]): this;
}
