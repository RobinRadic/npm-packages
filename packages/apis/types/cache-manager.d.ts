// noinspection ES6UnusedImports
import cacheManager,{ CachingConfig }  from 'cache-manager';

declare module 'cache-manager' {


    export interface Cache {
        wrap<T>(key: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, work: (callback: (error: any, result: T) => void) => void, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig): void

        wrap<T>(key: string, work: (callback: (error: any, result: T) => void) => void): Promise<any>;


        wrap<T>(key: string, key2: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, key2: string, work: (callback: (error: any, result: T) => void) => void, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, key2: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig): void

        wrap<T>(key: string, key2: string, work: (callback: (error: any, result: T) => void) => void): Promise<any>;


        wrap<T>(key: string, key2: string, key3: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, key2: string, key3: string, work: (callback: (error: any, result: T) => void) => void, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, key2: string, key3: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig): void

        wrap<T>(key: string, key2: string, key3: string, work: (callback: (error: any, result: T) => void) => void): Promise<any>;


        wrap<T>(key: string, key2: string, key3: string, key4: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, key2: string, key3: string, key4: string, work: (callback: (error: any, result: T) => void) => void, callback: (error: any, result: T) => void): void

        wrap<T>(key: string, key2: string, key3: string, key4: string, work: (callback: (error: any, result: T) => void) => void, options: CachingConfig): void

        wrap<T>(key: string, key2: string, key3: string, key4: string, work: (callback: (error: any, result: T) => void) => void): Promise<any>;
    }
}
