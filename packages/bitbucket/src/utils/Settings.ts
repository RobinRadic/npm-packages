// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash';
import { join } from "path";
import { homedir } from "os";
import { exists, read, write } from './fs';
import { parse } from 'dotenv';

export interface Settings<T> {
    get<T>(path: string, defaultValue?: any): T;
}

export class Settings<T> {
    protected data: Partial<T> = {}
    constructor(data: Partial<T> = {}) {
        this.data = data;
        this.merge(this.getGlobals());
    }
    globalSettingsPath: string = join(homedir(), '.bitbucketrc');

    static dotEnvPaths: string[]      = [ join(process.cwd(), '.env') ]

    static  loadDotEnv():Settings<any> {
        let env = this.dotEnvPaths
            .filter(p => {
                return exists(p) as any
            })
            .map(p => {
                return parse(read(p)) as any
            })
            .reduce((obj, [ k, v ]) => ({ ...obj, [ k ]: v }))
        // .reduce(objectify, {});

        return new Settings<any>(env);
    }

    protected getGlobals(): Partial<T> {
        if ( ! exists(this.globalSettingsPath) ) {
            write('{}', this.globalSettingsPath)
        }
        return JSON.parse(read(this.globalSettingsPath));
    }

    public setGlobals(settings: Partial<T>) {
        if ( exists(this.globalSettingsPath) ) {
            settings = merge({}, JSON.parse(read(this.globalSettingsPath)), settings);
        }
        write(JSON.stringify(settings, null, 4), this.globalSettingsPath);
    }
    get      = <T>(path: string, defaultValue?: any): T => get(this.data, path, defaultValue);
    set      = (path: string, value: any) => set(this.data, path, value);
    has      = (path: string) => has(this.data, path);
    unset    = (path: string) => unset(this.data, path);
    merge    = (value: Partial<T>) => merge(this.data, value);
    mergeAt  = (path: string, value: any) => this.set(path, merge({}, this.get(path, {}), value));
    pushTo   = (path: string, ...items: any[]) => this.set(path, this.get<Array<any>>(path, []).concat(items));
    raw      = (): T => this.data as T;
    getClone = <T>(path?: string, defaultValue: any = {}): T => (path ? cloneDeep(this.get(path, defaultValue)) : cloneDeep(this.raw())) as any;

    static proxied<T>(data:T): Settings<T> {
        return new Proxy(new Settings<T>(data), {
            get(target: Settings<T>, p: PropertyKey, receiver: any): any {
                if ( target.has(p.toString()) ) {
                    return target.get(p.toString());
                }
                return target[ p ];
            },
            set(target: Settings<T>, p: PropertyKey, value: any, receiver: any): boolean {
                target.set(p.toString(), value);
                return true;
            },
            has(target: Settings<T>, p: PropertyKey): boolean {
                return target.has(p.toString());
            },
        });

    }
}

