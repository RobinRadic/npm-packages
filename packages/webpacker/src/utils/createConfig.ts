// noinspection ES6UnusedImports
import { get, has, merge, set, unset } from 'lodash';
import { ConfigProxy } from '../interfaces';

let methods       = { get, set, has, merge, unset };
let returnMethods = [ 'get', 'has' ];


export function createConfig<T extends object>(config: T): ConfigProxy<T> {
    const proxy = new Proxy(config, {
        get(target: T, p: string | number | symbol, receiver: any): any {
            if ( target[ p ] !== undefined ) {
                return target[ p ];
            }
            let prop = p.toString();
            if ( Object.keys(methods).includes(prop) ) {
                return (...params) => {
                    let result = methods[ prop ](target, ...params);
                    if ( returnMethods.includes(prop) ) {
                        return result;
                    }
                    return proxy;
                };
            }
        },
    });
    return proxy as any;
}
