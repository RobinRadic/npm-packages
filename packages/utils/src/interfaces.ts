export type ValueOf<T> = T[keyof T];

export type Dictionary<T> = Record<string, T>
