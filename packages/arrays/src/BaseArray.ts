
const isArrayInside  = <T = any>(val: any): val is [ T[] ] => {
    return Array.isArray(val) && val.length === 1 && Array.isArray(val[ 0 ]);
};

export default class BaseArray<T> extends Array<T> implements Array<T> {
    filter: (callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any) => this;
    map: <U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) => BaseArray<U>;

    constructor(...items: T[]) {
        if ( isArrayInside(items) ) {
            items = items[ 0 ];
        }
        super(...items);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    newInstance(...items: T[]): this {
        let Class    = this.constructor as any;
        let instance = new Class(...items);
        return instance as this;
    }
}

