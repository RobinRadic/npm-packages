import { rget, rhas, rset }            from './reflect';
import { get, has, merge, set, unset } from 'lodash';
import 'reflect-metadata';

export class Meta {
    private get data() {
        if ( rhas(this.name, this.target) ) {
            this._data = rget(this.name, this.target);
        }
        return this._data;
    }

    private set data(val) {
        this._data = val;
        rset(this.name, this._data, this.target);
    }

    private _data = {};

    private saveData() {rset(this.name, this._data, this.target); }

    public constructor(protected  target: Function, private name = 'META') {
        this._data = {};
        if ( rhas(this.name, this.target) ) {
            this._data = rget(this.name, this.target);
        }
    }

    public get(path?: string, defaultValue?) {
        if ( !path ) return this._data;
        return get(this._data, path, defaultValue);
    }

    public set(path, value) {
        set(this._data, path, value);
        this.saveData();
        return this;
    }

    public has(path, value) {has(this.data, path);}

    public merge(path, value) {
        merge(this._data, path, value);
        this.saveData();
    }

    public unset(path, value) {
        unset(this._data, path);
        this.saveData();
        return this;
    }

    public static get(_target: Function | Object, name = 'META'): Meta {
        let target = this.resolveTarget(_target);
        let meta   = new this(target, name);
        return meta;
    }

    protected static resolveTarget(target): Function {
        if ( this.isTargetWithConstructor(target) ) {
            return target.constructor;
        } else if ( this.isConstructorTarget(target) ) {
            return target;
        }
        throw Error('Invalid target');
    }

    private static isConstructorTarget     = (val): val is Function => typeof val === 'function';
    private static isTargetWithConstructor = (val): val is Object => typeof val === 'object' && 'constructor' in val;
}

export const meta = (target, name?) => Meta.get(target, name);
