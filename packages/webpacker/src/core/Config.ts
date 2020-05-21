// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash';
import { EventEmitter }                           from 'events';

export interface Config<T> {
    get<T>(path: string, defaultValue?: any): T;
}

export namespace Config {
    export type Proxied<T> = Config<T> & T
}

export type ConfigChangeEventListener<T,V=any> = (change: { value:  V }) => void
export type ConfigChangedEventListener<T,V=any> = (value: V) => void
export type ConfigEventListener<T,V=any> = ConfigChangedEventListener<T,V> | ConfigChangeEventListener<T,V>

export class Config<T> {
    protected __events         = new EventEmitter();
    protected __trigger_events = true;

    constructor(protected data: Partial<T> = {}) {}

    get      = <T>(path: string, defaultValue?: any): T => get(this.data, path, defaultValue);
    set      = (path: string, value: any) => {
        let _set = { value };
        this.emit('change:' + path, _set);
        set(this.data, path, _set.value);
        this.emit('changed:' + path, _set.value);
    }
    has      = (path: string) => has(this.data, path);
    unset    = (path: string) => unset(this.data, path);
    merge    = (...values: any) => merge(this.data, ...values);
    mergeAt  = (path: string, value: any) => this.set(path, merge({}, this.get(path, {}), value));
    pushTo   = (path: string, ...items: any[]) => this.set(path, this.get<Array<any>>(path, []).concat(items));
    raw      = (): T => this.data as T;
    getClone = <T>(path?: string, defaultValue: any = {}): T => (path ? cloneDeep(this.get(path, defaultValue)) : cloneDeep(this.raw())) as any;

    //@formatter:off
    protected on(event: string | symbol, listener: ConfigEventListener<T>): this {this.__trigger_events && this.__events.on.apply(this.__events, arguments); return this;};
    protected once(event: string | symbol, listener: ConfigEventListener<T>): this {this.__trigger_events && this.__events.once.apply(this.__events, arguments); return this;};
    protected off(event: string | symbol, listener: ConfigEventListener<T>): this {this.__trigger_events && this.__events.off.apply(this.__events, arguments); return this;};
    protected emit(event: string | symbol, ...args: any[]): boolean {return this.__trigger_events &&  this.__events.emit.apply(this.__events, arguments);};
    //@formatter:on
    onChange<K extends keyof T>(key: K, listener: ConfigChangeEventListener<T,T[K]>): this {return this.on('change:' + key, listener);}
    onChanged<K extends keyof T>(key: K, listener: ConfigChangedEventListener<T>): this {return this.on('changed:' + key, listener);}

    proxy = (path: string) => {
        const prefix = (p: PropertyKey) => path + '.' + p.toString();
        return new Proxy(this, {
            get(target: Config<T>, p: PropertyKey, receiver: any): any {
                if ( target.has(prefix(p)) ) {
                    return target.get(prefix(p));
                }
                return target[ p ];
            },
            set(target: Config<T>, p: PropertyKey, value: any, receiver: any): boolean {

                target.set(prefix(p), value);
                return true;
            },
            has(target: Config<T>, p: PropertyKey): boolean {
                return target.has(prefix(p));
            },
        });
    };

    static proxied<T>(data): Config.Proxied<T> {
        let proxy = <Config.Proxied<T>>new Proxy(new Config<T>(data), {
            get(target: Config<T>, p: PropertyKey, receiver: any): any {
                if ( target.has(p.toString()) ) {
                    return target.get(p.toString());
                }
                return target[ p ];
            },
            set(target: Config<T>, p: PropertyKey, value: any, receiver: any): boolean {
                let set = { value };
                target.emit('change:' + p.toString(), set, proxy);
                target.set(p.toString(), set.value);
                target.emit('changed:' + p.toString(), set.value, proxy);
                return true;
            },
            has(target: Config<T>, p: PropertyKey): boolean {
                return target.has(p.toString());
            },
        });
        return proxy;
    }
}

// var INJECTION = Symbol.for('INJECTION');
//
// function _proxyGetter(proto, key, resolve, doCache) {
//     function getter() {
//         if ( doCache && !Reflect.hasMetadata(INJECTION, this, key) ) {
//             Reflect.defineMetadata(INJECTION, resolve(), this, key);
//         }
//         if ( Reflect.hasMetadata(INJECTION, this, key) ) {
//             return Reflect.getMetadata(INJECTION, this, key);
//         } else {
//             return resolve();
//         }
//     }
//
//     function setter(newVal) {
//         Reflect.defineMetadata(INJECTION, newVal, this, key);
//     }
//
//     Object.defineProperty(proto, key, {
//         configurable: true,
//         enumerable  : true,
//         get         : getter,
//         set         : setter
//     });
// }
//
// export function configProxy<T>(path: string): PropertyDecorator {
//     return (proto, key) => {
//         var resolve = function () {
//             let config = Config.app.get<Config<IConfig>>('config');
//             return config.proxy(path);
//         };
//         _proxyGetter(proto, key, resolve, true);
//     };
// }
//
//
// export function configValue(path: string): PropertyDecorator {
//     return (proto, key) => {
//         var resolve = function () {
//             let config = Config.app.get<Config<IConfig>>('config');
//             return config.get(path);
//         };
//         _proxyGetter(proto, key, resolve, false);
//     };
// }
