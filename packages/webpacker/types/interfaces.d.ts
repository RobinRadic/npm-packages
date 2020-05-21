export declare type ConfigProxy<T> = T & {
    get<V>(prop: keyof T | string, defaultValue?: any): V;
    has(prop: keyof T | string): boolean;
    set<K extends keyof T>(prop: K | string, value: T[K]): ConfigProxy<T>;
    merge(...values: Partial<T>[]): ConfigProxy<T>;
    unset(prop: keyof T | string): ConfigProxy<T>;
};
