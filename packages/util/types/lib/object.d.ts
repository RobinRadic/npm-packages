declare function getParts(str: any): any;
/**
 * Get a child of the object using dot notation
 * @param obj
 * @param parts
 * @param create
 * @returns {any}
 */
declare function objectGet(obj?: any, parts?: any, create?: any): any;
/**
 * Set a value of a child of the object using dot notation
 * @param obj
 * @param parts
 * @param value
 * @returns {any}
 */
declare function objectSet(obj: any, parts: any, value: any): any;
/**
 * Check if a child of the object exists using dot notation
 * @param obj
 * @param parts
 * @returns {boolean|any}
 */
declare function objectExists(obj: any, parts: any): boolean;
declare function recurse(value: Object, fn: Function, fnContinue?: Function): any;
/**
 * Copy an object, creating a new object and leaving the old intact
 * @param object
 * @returns {T}
 */
declare function copyObject<T>(object: T): T;
/**
 * Flatten an object to a dot notated associative array
 * @param obj
 * @param prefix
 * @returns {any}
 */
declare function dotize(obj: any, prefix?: any): any;
declare function objectLoop(obj: any, callback: (key: string, item: any) => void): void;
export declare class StringType {
    value: string;
    constructor(value: string);
    toString(): string;
    /** Returns the primitive value of the specified object. */
    valueOf(): string;
    static all(): any[];
}
declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
export declare class DependencySorter {
    /**
     * @var array
     */
    protected items: any;
    /**
     * @var array
     */
    protected dependencies: any;
    /**
     * @var array
     */
    protected dependsOn: any;
    /**
     * @var array
     */
    protected missing: any;
    /**
     * @var array
     */
    protected circular: any;
    /**
     * @var array
     */
    protected hits: any;
    /**
     * @var array
     */
    protected sorted: any;
    constructor();
    add(items: {
        [name: string]: string | string[];
    }): void;
    addItem(name: string, deps?: string | string[]): void;
    setItem(name: string, deps: string[]): void;
    sort(): string[];
    protected satisfied(name: string): boolean;
    /**
     * setSorted
     *
     * @param item
     */
    protected setSorted(item: any): void;
    protected exists(item: any): boolean;
    /**
     * removeDependents
     *
     * @param item
     */
    protected removeDependents(item: any): void;
    /**
     * setCircular
     *
     * @param item
     * @param item2
     */
    protected setCircular(item: any, item2: any): void;
    /**
     * setMissing
     *
     * @param item
     * @param item2
     */
    protected setMissing(item: any, item2: any): void;
    /**
     * setFound
     *
     * @param item
     * @param item2
     */
    protected setFound(item: any, item2: any): void;
    /**
     * isSorted
     *
     * @param item
     * @return bool
     */
    protected isSorted(item: string): boolean;
    requiredBy(item: string): boolean;
    isDependent(item: string, item2: string): boolean;
    hasDependents(item: any): boolean;
    hasMissing(item: any): boolean;
    isMissing(dep: string): boolean;
    hasCircular(item: string): boolean;
    isCircular(dep: any): boolean;
    /**
     * getDependents
     *
     * @param item
     * @return mixed
     */
    getDependents(item: any): string[];
    getMissing(str?: any): string[];
    getCircular(str?: any): any;
    getHits(str?: any): any;
}
export declare function everyKey<T extends object, U extends T>(obj: T, cb: (key?: string, obj?: T, index?: number, keys?: string[]) => U): U[];
export declare type KeyObjectArray<T extends object> = [string, T];
export declare function omap<T extends object>(obj: T, cb: (obj?: T, key?: string, index?: number, keys?: string[]) => T | KeyObjectArray<T>): T;
/**
 * https://github.com/likerRr/ts-mixin
 * @param mixins
 * @constructor
 */
export declare function Mixin<T>(...mixins: Array<new (...args: any[]) => any>): new (...args: any[]) => T;
export { objectLoop, getParts, objectExists, objectGet, objectSet, copyObject, applyMixins, recurse, dotize };
