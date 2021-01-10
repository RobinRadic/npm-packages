import { defaultsDeep }           from 'lodash';
import { includeAny, meta, rget } from '../util';
import { DesignType }             from '../types';

export type Switches = Array<'required'>
export type Config = Options | Switches | Array<Options | Switches>;

export interface Decorator {
    (configuration?: Config)

    (required: boolean, configuration?: Config)

    (description: string, configuration?: Config)

    (required: boolean, description: string, configuration?: Config)
}

export interface Options {
    method?: string
    index?: number
    defaultValue?: any
    type?: DesignType<any>
    description?: string
    required?: boolean
    validate?: ((value: any) => true | string) | string
    transform?: ((value: any) => boolean) | string | Function
}

export const optionKeys: (keyof Options)[] = [ 'description', 'defaultValue', 'required', 'validate', 'transform' ];
export const switchesKeys: Switches        = [ 'required' ];

export const isSwitches        = (value: any): value is Switches => Array.isArray(value) && includeAny(value, switchesKeys);
export const isOptions         = (value: any): value is Options => typeof value === 'object' && includeAny(Object.keys(value), optionKeys);
export const isDescription     = (value: any): value is string => typeof value === 'string';
export const isRequired        = (value: any): value is boolean => typeof value === 'boolean';

export function createOptions(...options: Array<Partial<Options>>): Options {
    return defaultsDeep({
        description: '',
        required   : false,
        validate   : () => true,
        transform  : (val) => val,
    }, ...options);
}

export function resolveDecoratorParameters(...args: any[]): Options {
    let opts: Options = {};
    for ( const arg of args ) {
        switch(true){//@formatter:off
            case isOptions(arg): opts = { ...opts, ...arg }; break;
            case isSwitches(arg): arg.forEach(name => opts[ name ] = true); break;
            case isDescription(arg): opts.description=arg; break;
            case isRequired(arg): opts.required=arg; break;
        }//@formatter:on
    }
    return opts;
}

export let argument: Decorator = (...args: any[]): ParameterDecorator => {
    let options: Options = resolveDecoratorParameters(args);
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        options = createOptions(options, {
            method: propertyKey.toString(),
            index : parameterIndex,
            type  : rget('design:type', target, propertyKey),
        });
        meta(target).set(`arguments.${parameterIndex}`, options);
    };
};
