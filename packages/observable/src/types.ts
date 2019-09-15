
export type ObserverChangedType = 'update' | 'add' | 'delete';

export interface ObserverChanged<O = any, K extends keyof O = keyof O, V = O[K]> {
    object: O
    type: ObserverChangedType
    name: K;
    newValue?: V;
    oldValue?: V;
}

export type ObserverChangedFunction<O = any, K extends keyof O = keyof O, V = O[K]> = (change: ObserverChanged<O, K, V>) => void

export type ObserverSubscription = { unsubscribe() }
