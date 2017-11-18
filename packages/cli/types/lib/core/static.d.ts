/// <reference types="node" />
import { ExecSyncOptionsWithStringEncoding } from "child_process";
export declare const PKG: () => any;
export declare const MILISECOND = 1;
export declare const SECOND: number;
export declare const MINUTE: number;
export declare const HOUR: number;
export declare const DAY: number;
export declare const WEEK: number;
export declare const MONTH: number;
export declare const YEAR: number;
export declare function createExecString(cmd: string, args: any[]): string;
export declare function bin(cmd: any, options?: ExecSyncOptionsWithStringEncoding): (...args: any[]) => string;
/**
 *
 * @link https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 formatBytes(1000);       // 1 KB
 formatBytes('1000');     // 1 KB
 formatBytes(1234);       // 1.23 KB
 formatBytes(1234, 3);    // 1.234 KB

 * @param {number} bytes
 * @param decimals
 * @returns {any}
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
export declare function folderSize(path: string): Promise<number>;
