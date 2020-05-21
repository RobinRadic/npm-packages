//
// declare module '@yarnpkg/lockfile' {
//     export interface LockPackage {
//         version: string
//         resolved: string
//         integrity: string
//         dependencies?: Record<string, string>
//     }
//
//     export type LockObject = Record<string, LockPackage>
//
//     export interface ParsedLock {
//         type: 'success' | string
//         object: LockObject
//     }
//
//     export function parse<T extends ParsedLock = ParsedLock>(str: string): T;
//
//     export function stringify(json: any): string;
// }
