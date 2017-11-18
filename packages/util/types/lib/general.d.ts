/**
 * Round a value to a precision
 * @param value
 * @param places
 * @returns {number}
 */
export declare function round(value: any, places: any): number;
/**
 * Create a string from an object
 *
 * @param object
 * @returns {any}
 */
export declare function makeString(object: any): string;
export declare function defaultToWhiteSpace(characters: any): any;
export declare type KindOf = 'number' | 'string' | 'boolean' | 'function' | 'regexp' | 'array' | 'date' | 'error' | 'object' | 'null' | 'undefined';
/**
 * Returns the method of a variablse
 *
 * @param value
 * @returns {any}
 */
export declare function kindOf(value: any): KindOf;
/**
 * If val is not defined, return def as default
 * @param val
 * @param def
 * @returns {any}
 */
export declare function def(val: any, def: any): any;
/**
 * Checks wether the passed variable is defined
 *
 * @param obj
 * @returns {boolean}
 */
export declare function defined(obj?: any): boolean;
/**
 * Get a random generated id string
 *
 * @param length
 * @returns {string}
 */
export declare function getRandomId(length?: number): string;
export declare function guid(): string;
export declare function guidSeg(): string;
export declare let isAnyLength: (value: any, ...lengths: any[]) => boolean;
export declare let isAllLength: (value: any, ...lengths: any[]) => boolean;
export { isAnyLength as isLength };
