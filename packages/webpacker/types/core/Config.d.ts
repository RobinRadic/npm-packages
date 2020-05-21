/// <reference types="node" />
import { EventEmitter } from 'events';
export interface Config<T> {
    get<T>(path: string, defaultValue?: any): T;
}
export declare namespace Config {
    type Proxied<T> = Config<T> & T;
}
export declare type ConfigChangeEventListener<T, V = any> = (change: {
    value: V;
}) => void;
export declare type ConfigChangedEventListener<T, V = any> = (value: V) => void;
export declare type ConfigEventListener<T, V = any> = ConfigChangedEventListener<T, V> | ConfigChangeEventListener<T, V>;
export declare class Config<T> {
    protected data: Partial<T>;
    protected __events: EventEmitter;
    protected __trigger_events: boolean;
    constructor(data?: Partial<T>);
    get: <T_1>(path: string, defaultValue?: any) => T_1;
    set: (path: string, value: any) => void;
    has: (path: string) => boolean;
    unset: (path: string) => boolean;
    merge: (...values: any) => any;
    mergeAt: (path: string, value: any) => void;
    pushTo: (path: string, ...items: any[]) => void;
    raw: () => T;
    getClone: <T_1>(path?: string, defaultValue?: any) => T_1;
    protected on(event: string | symbol, listener: ConfigEventListener<T>): this;
    protected once(event: string | symbol, listener: ConfigEventListener<T>): this;
    protected off(event: string | symbol, listener: ConfigEventListener<T>): this;
    protected emit(event: string | symbol, ...args: any[]): boolean;
    onChange<K extends keyof T>(key: K, listener: ConfigChangeEventListener<T, T[K]>): this;
    onChanged<K extends keyof T>(key: K, listener: ConfigChangedEventListener<T>): this;
    proxy: (path: string) => Config<T>;
    static proxied<T>(data: any): Config.Proxied<T>;
}
