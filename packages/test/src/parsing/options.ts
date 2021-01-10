import { defaultsDeep }           from 'lodash';
import { includeAny, meta, rget } from '../util';
import { DesignType }             from '../types';


export type Character = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

export type Switches = Array<'array' | 'required'>

export type Config = Options | Switches | Array<Options | Switches>;

export interface Decorator {
    (configuration?: Config): PropertyDecorator & OptionModifiers

    (short: Character, configuration?: Config): PropertyDecorator & OptionModifiers

    (short: Character, defaultValue?: any, configuration?: Config): PropertyDecorator & OptionModifiers
}

export interface Options {
    name?: string
    short?: Character
    defaultValue?: any
    description?: string
    arguments?: number
    count?: number
    type?: DesignType<any>
    array?: boolean
    required?: boolean
    validate?: ((value: any) => true | string) | string
    transform?: ((value: any) => boolean) | string | Function
}


export interface MetaData {
    type: DesignType<any>
    propertyKey: string | symbol
    options: Options
}

export interface OptionModifiers {

}

export const characterKeys: Character[]    = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
export const optionKeys: (keyof Options)[] = [ 'description', 'short', 'defaultValue', 'array', 'required', 'validate', 'transform' ];
export const switchesKeys: Switches        = [ 'array', 'required' ];

export const isSwitches        = (value: any): value is Switches => Array.isArray(value) && includeAny(value, switchesKeys);
export const isShort           = (value: any): value is Character => value.length === 1 && characterKeys.includes(value);
export const isOptions         = (value: any): value is Options => typeof value === 'object' && includeAny(Object.keys(value), optionKeys);
export const isDefault         = (value: any): value is any => !isShort(value) && !isSwitches(value) && !isOptions(value);
export const isDirectFunction  = (value: any): value is Function => typeof value === 'function';
export const isCommandFunction = (value: any): value is string => typeof value === 'string';

export function createOptions(...options: Array<Partial<Options>>): Options {
    return defaultsDeep({
        arguments: 0,
        count    : 0,
        array    : false,
        required : false,
        validate : () => true,
        transform: (val) => val,
    }, ...options);
}

export function resolveDecoratorParameters(...args: any[]): Options {
    let opts: Options = {};
    args.forEach((arg, i) => {
        switch(true){//@formatter:off
            case isOptions(arg): opts = { ...opts, ...arg }; break;
            case isSwitches(arg): arg.forEach(name => opts[ name ] = true); break;
            case isShort(arg): opts.short=arg; break;
            case i === 1 && isDefault(arg): opts.defaultValue=arg; break;
        }//@formatter:on
    })
    return opts;
}

export let option: Decorator = function (...args: any[]): PropertyDecorator {
    let options: Options = resolveDecoratorParameters(...args);
    return (target: Object, propertyKey: string | symbol) => {
        options = createOptions(options, {
            name: propertyKey.toString(),
            type: rget('design:type', target, propertyKey),
        });
        meta(target).set(`options.${propertyKey.toString()}`, options);
    };
};
