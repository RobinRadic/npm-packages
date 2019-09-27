// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash';

export interface Dot<T> {
    get<T>(path: string, defaultValue?: any): T;
}

export class Dot<T> {

    constructor(protected data: Partial<T> = {}) { }

    get      = <T>(path: string, defaultValue?: any): T => get(this.data, path, defaultValue);
    set      = (path: string, value: any) => set(this.data, path, value);
    has      = (path: string) => has(this.data, path);
    unset    = (path: string) => unset(this.data, path);
    merge    = (value: Partial<T>) => merge(this.data, value);
    mergeAt  = (path: string, value: any) => this.set(path, merge({}, this.get(path, {}), value));
    pushTo   = (path: string, ...items: any[]) => this.set(path, this.get<Array<any>>(path, []).concat(items));
    raw      = (): T => this.data as T;
    getClone = <T>(path?: string, defaultValue: any = {}): T => (path ? cloneDeep(this.get(path, defaultValue)) : cloneDeep(this.raw())) as any;

    static make<T>(data:T):Dot<T>{
        return new this<T>(data);
    }

    static proxied<T>(data: T): Dot<T> {
        return new Proxy(this.make<T>(data), {
            get(target: Dot<T>, p: PropertyKey, receiver: any): any {
                if ( target.has(p.toString()) ) {
                    return target.get(p.toString());
                }
                return target[ p ];
            },
            set(target: Dot<T>, p: PropertyKey, value: any, receiver: any): boolean {
                target.set(p.toString(), value);
                return true;
            },
            has(target: Dot<T>, p: PropertyKey): boolean {
                return target.has(p.toString());
            },
        });

    }
}

