import { kindOf } from '../general';
import { IStorageBagOptions } from './interfaces';

export class StorageMeta implements IStorageBagOptions {

    json: boolean   = true
    expires: number = null

    constructor(options: IStorageBagOptions = {}) {
        this.merge(options);
    }

    merge(options: IStorageBagOptions): this {
        Object.keys(options).forEach(key => this[key] = options[key])
        return this;
    }

    static create(options?: IStorageBagOptions): StorageMeta { return new StorageMeta(options); }

    static fromString(meta: string): StorageMeta { return new StorageMeta(JSON.parse(meta)); }

    toString(): string { return JSON.stringify({ json: this.json, expires: this.expires }); }

    expiresIn(minutes: number) { this.expires = Math.floor((Date.now() / 1000) / 60) + minutes; }

    isExpired(): boolean {
        if ( ! this.canExpire() ) {
            return false;
        }
        let now = Math.floor((Date.now() / 1000) / 60);
        return now > this.expires;
    }

    canExpire(): boolean { return this.expires && this.expires !== null && kindOf(this.expires) === "number"; }

    isJSON(): boolean { return this.json === true }

    setJSON(val: boolean) { this.json = val }
}