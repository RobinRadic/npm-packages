import { BaseArray }          from './BaseArray';
import { nestedValue }        from './utils/nestedValue';
import { ComparisonOperator } from './interfaces';
import { canAccessAsArray }   from './utils/canAccessAsArray';
import { isArrayLike }        from './utils/isArrayLike';

export const list = <T>(items: T[]) => new List<T>(...items);

const isArrayInside = <T = any>(val: any): val is [ T[] ] => {
    return Array.isArray(val) && val.length === 1 && Array.isArray(val[ 0 ]);
};

export class List<T> extends Array<T> implements Array<T> {
    filter: (callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any) => this;
    map: <U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) => BaseArray<U>;

    constructor(...items: T[] | [ T[] ]) {
        items = isArrayInside(items) ? items[ 0 ] : items;
        super(...items);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static wrap<T>(value: T[]) {
        if ( value instanceof this ) {
            return value;
        }
        if ( Array.isArray(value) ) {
            return new this<T>(...value);
        }
        if ( isArrayLike(value) || canAccessAsArray(value) ) {
            return new this<T>(...Array.from<T>(value as any));
        }
        return new this<T>(...Array.of(value));
    }

    newInstance(...items: T[] | [ T[] ]): this {
        items        = isArrayInside(items) ? items[ 0 ] : items;
        let Class    = this.constructor as any;
        let instance = new Class(...items);
        return instance as this;
    }

    isEmpty() { return this.length === 0;}

    isNotEmpty() { return this.length > 0;}

    first<U = T>(): U { return this[ 0 ] as any; }

    last<U = T>(): U { return this[ this.length - 1 ] as any; }

    findBy(key: keyof T, value: any): T | undefined { return this.find(item => item[ key ] === value); }

    each(callbackfn: (value: T, index: number, array: T[]) => void) {
        this.forEach(callbackfn);
        return this;
    }

    item(key: number): T { return this[ key ]; }

    hasItem(key: number): boolean { return this[ key ] !== undefined;}

    without(item: any[]) {return this.filter(i => !item.includes(i)); }

    only(item: any[]) {return this.filter(i => item.includes(i)); }

    whereNot(key: keyof T, value: any): this { return this.filter(item => item[ key ] !== value); }

    whereIn(key: keyof T, values: any[]): this {return this.filter(item => values.includes(item[ key ]) === true); }

    whereNotIn(key: keyof T, values: any[]): this {return this.filter(item => values.includes(item[ key ]) === false); }

    firstWhere<U = T>(key: keyof T|string, value: any): U
    firstWhere<U = T>(key: keyof T|string, operator: ComparisonOperator, value: any): U
    firstWhere<U = T>(key: keyof T|string, operator: any, value?: any): U {
        return this.where(key, operator, value).first<U>();
    }

    where(key: keyof T|string, value: any): this
    where(key: keyof T|string, operator: ComparisonOperator, value: any): this
    where(key: keyof T|string, operator: any, value?: any): this {
        let comparisonOperator: ComparisonOperator = operator;
        let comparisonValue: any                   = value;

        const items = [].concat(this);

        if ( operator === undefined || operator === true ) {
            return this.newInstance(items.filter(item => nestedValue(item, key)));
        }

        if ( operator === false ) {
            return this.newInstance(items.filter(item => !nestedValue(item, key)));
        }

        if ( value === undefined ) {
            comparisonValue    = operator;
            comparisonOperator = '===';
        }

        const collection = this.filter((item) => {
            switch ( comparisonOperator ) {
                case '==':
                    return nestedValue(item, key) === Number(comparisonValue)
                        || nestedValue(item, key) === comparisonValue.toString();

                default:
                case '===':
                    return nestedValue(item, key) === comparisonValue;

                case '!=':
                case '<>':
                    return nestedValue(item, key) !== Number(comparisonValue)
                        && nestedValue(item, key) !== comparisonValue.toString();

                case '!==':
                    return nestedValue(item, key) !== comparisonValue;

                case '<':
                    return nestedValue(item, key) < comparisonValue;

                case '<=':
                    return nestedValue(item, key) <= comparisonValue;

                case '>':
                    return nestedValue(item, key) > comparisonValue;

                case '>=':
                    return nestedValue(item, key) >= comparisonValue;
            }
        });

        return collection;
    }

    sortBy(key: keyof T | Function, direction: 'asc' | 'desc' = 'asc'): this {
        const getValue = (item) => {
            if ( typeof key === 'function' ) {
                return this.newInstance(key(item));
            }

            return nestedValue(item, key);
        };

        const sorted = [].concat(this).sort((a, b) => {
            const valueA = getValue(a);
            const valueB = getValue(b);

            if ( valueA === null || valueA === undefined ) {
                return 1;
            }
            if ( valueB === null || valueB === undefined ) {
                return - 1;
            }

            if ( valueA < valueB ) {
                return - 1;
            }
            if ( valueA > valueB ) {
                return 1;
            }

            return 0;
        });

        return direction === 'asc' ? sorted : sorted.reverse() as any;
    }

    split(numOfGroups: number, balanced: boolean = false): T[][] {

        if ( numOfGroups < 2 )
            return [ this ];

        var len = this.length,
            out = [],
            i   = 0,
            size;

        if ( len % numOfGroups === 0 ) {
            size = Math.floor(len / numOfGroups);
            while ( i < len ) {
                out.push(this.slice(i, i += size));
            }
        } else if ( balanced ) {
            while ( i < len ) {
                size = Math.ceil((len - i) / numOfGroups --);
                out.push(this.slice(i, i += size));
            }
        } else {

            numOfGroups --;
            size = Math.floor(len / numOfGroups);
            if ( len % size === 0 )
                size --;
            while ( i < size * numOfGroups ) {
                out.push(this.slice(i, i += size));
            }
            out.push(this.slice(size * numOfGroups));

        }

        return out;
    }
}

