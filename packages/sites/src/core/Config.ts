import { cloneDeep,get,set,has,unset,merge } from 'lodash';
import { Application }                       from './Application';
import {toJS}                                from '../utils'
import Conf                                  from 'conf';

export interface Config<T> extends Omit<Conf<T>,'set'|'get'|'has'> {

}

export class Config<T> {
    public static app: Application

    constructor(protected conf: Conf<T>) {}

    get      = <T>(path: string, defaultValue?: any): T => this.conf.get(path as any, defaultValue as any) as any;
    set      = (path: string, value: any) => this.conf.set(path as any, value);
    has      = (path: string) => this.conf.has(path as any);
    unset    = (path: string) => this.conf.delete( path as any);
    merge    = (value: any) => this.conf.store=merge({},this.conf.store,value);
    mergeAt  = (path: string, value: any) => this.set(path, merge({}, this.get(path, {}), value));
    pushTo   = (path: string, ...items: any[]) => this.set(path, this.get<Array<any>>(path, []).concat(items));
    raw      = (): T => this.conf.store as T;
    getClone = <T>(path?: string, defaultValue: any = {}): T => (path ? cloneDeep(this.get(path, defaultValue)) : cloneDeep(this.raw())) as any;
    toJS     = (path?: string) => path ? toJS(this.get(path)) : toJS(this.raw());

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
            }
        });
    };

    static proxied<T>(conf: Conf<T>): Config<T> & T {
        return new Proxy<any>(new Config<T>(conf), {
            get(target: Config<T>, p: PropertyKey, receiver: any): any {
                if ( target.has(p.toString()) ) {
                    return target.get(p.toString());
                }
                return target[ p ];
            },
            set(target: Config<T>, p: PropertyKey, value: any, receiver: any): boolean {
                target.set(p.toString(), value);
                return true;
            },
            has(target: Config<T>, p: PropertyKey): boolean {
                return target.has(p.toString());
            }
        });

    }
}
