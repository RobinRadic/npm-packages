import { INode } from './interfaces';


export function collect<T>(items: T[]) {
    return new Collection<T>(...items);
}

export class Collection<T> extends Array<T> implements Array<T> {
    filter: (callbackfn: (value: T, index: number, array:T[]) => any, thisArg?: any) => this

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static make<T>(items: T[] = []) { return new (this)(...items); }

    isEmpty() { return this.length === 0}
IMenuNode
    isNotEmpty() { return this.length > 0}

    first() { return this[ 0 ]; }

    last() { return this[ this.length - 1 ]; }

    findBy(key: keyof T, value: any): T | undefined { return this.find(item => item[ key ] === value); }

    where(key: keyof T, value: any): this { return this.newInstance(...this.filter(item => item[ key ] === value)); }

    whereIn(key: keyof T, values: any[]): this {return this.newInstance(...this.filter(item => values.includes(item[ key ]) === true)); }

    whereNotIn(key: keyof T, values: any[]): this {return this.newInstance(...this.filter(item => values.includes(item[ key ]) === false)); }

    each(callbackfn: (value: T, index: number, array: T[]) => void){
        this.forEach(callbackfn);
        return this;
    }

    newInstance(...items: T[]): this {
        let Class    = this.constructor as any;
        let instance = new Class(...items);
        return instance as this;
    }

    keyBy<K extends keyof T>(key: K | ((item: T) => string)): Record<string, T> {
        let cb: ((item: T) => string) = key as any;
        if ( typeof key === 'string' ) {
            cb = item => item[ key as any ];
        }
        let result = {};
        this.forEach(item => {
            let key       = cb(item);
            result[ key ] = item;
        });
        return result as any;
    }

    mapKeyBy<K extends keyof T>(key: K | ((item: T) => string)): Map<K, T> {
        let cb: ((item: T) => string) = key as any;
        if ( typeof key === 'string' ) {
            cb = item => item[ key as any ];
        }
        let result = new Map();
        this.forEach(item => {
            let key = cb(item);
            result.set(key, item);
        });
        return result as any;
    }
}


export class NodeArray<T extends INode = INode> extends Collection<T> {

    item(key: number): T { return this[ key ] }

    hasItem(key: number): boolean { return this[ key ] !== undefined}

    depth(depth: number) {return this.filter(item => item.getDepth() === depth)}

    root() {return this.filter(item => item.isRoot)}

    without(item: any[]) {return this.filter(i => ! item.includes(i)) }

    only(item: any[]) {return this.filter(i => item.includes(i)) }

}
