import 'reflect-metadata';
import { detailed, Options as YargsOptions } from 'yargs-parser';
import { meta }                              from './Meta';
import { defaults, defaultsDeep }            from 'lodash';
import { rget }                              from './util';
// region Generic Utility methods, Types and Interfaces

export type DesignType<T> =
    | typeof String
    | typeof Object
    | typeof Number
    | typeof Function
    | typeof Number
    | typeof Math
    | typeof Date
    | typeof RegExp
    | typeof Error
    | typeof JSON
    | typeof Array
    | T


export enum ExitCode {
    OK                             = 0,
    ERROR                          = 1,
    COMMAND_LINE_USAGE_ERROR       = 2,
    COMMAND_INVOKED_CANNOT_EXECUTE = 126,
    COMMAND_NOT_FOUND              = 127,
    INVALID_ARGUMENT               = 128,
    FATAL_ERROR_SIGNAL             = '128+n',
    TERMINATED_BY_CTRL_C           = 130,
    EXIT_STATUS_OUT_OF_RANGE       = 255
}

export interface MetaData extends Object {
    command: Commands.MetaData
    options: Record<string, Options.Options>
    arguments: Record<string, Array<Arguments.Options>>

}

export type ConstructorTypeOf<T> = new (...args: any[]) => T;

export const isDirectFunction  = (value: any): value is Function => typeof value === 'function';
export const isCommandFunction = (value: any): value is string => typeof value === 'string';


const includeAny = (array, values) => values.some(r => array.indexOf(r) >= 0);

// endregion


// region Commands :: Decorator, Types, Utility

export namespace Commands {
    export interface Decorator {
        (options?: Options)
    }

    export interface MetaData {
        command: Options
        options: Options.Options
        arguments: Arguments.Options
    }

    export type Handler = ((...args) => Promise<any>) | string

    export interface Options {
        name?: string
        handler?: Handler
        autoRun?: boolean
    }

    export const defaultMetadata = (target: object) => ({
        options: {
            name   : target.constructor.name,
            handler: 'handle',
            autoRun: true,
        },
    });

    export const isHandlerFunction = (value: any): value is Function => typeof value === 'function';
    export const isHandlerName     = (value: any): value is string => typeof value === 'string';

    export async function run<T extends Commands.RuntimeCommand>(target, argv): Promise<ExitCode> {
        let parser = new Parser<T>(target);
        //let parsed = parser.parseOptions(argv);
        //let args   = parser.prepareArguments(parsed.argv._);
        let command = parser.parse(argv);
        return await command.__handle();
    }

    export let command: Commands.Decorator = (options?: Commands.Options): ClassDecorator => {
        return target => {
            options = defaults({
                name   : target.constructor.name,
                handler: 'handle',
                autoRun: true,
            }, options);
            let m   = meta(target);
            m.set('command', options);

            class RuntimeCommand extends (target as any) {
                static async run(argv?: string | string[]) {
                    argv     = argv || process.argv.slice(2);
                    let code = await run(this as any, argv);
                    process.exit(ExitCode[ code ]);
                }
            }

            if ( options.autoRun ) {
                RuntimeCommand.run(process.argv.slice(2)).then(result => {
                    console.log('end', result);
                });
            }

            return BaseCommand as any;
        };
    };

    export class BaseCommand {
        protected defaultExitCode: ExitCode = ExitCode.OK;

        protected exit(exitCode: ExitCode) {
            process.exit(ExitCode[ exitCode ]);
        }
    }

    export declare class RuntimeCommand extends BaseCommand {
        static run(argv?: string | string[]): Promise<any>

        __handle(): Promise<ExitCode>
    }

}

export const command: Commands.Decorator = Commands.command;

// endregion

// region Arguments :: Decorator, Types, Utility
export namespace Arguments {
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

    export function createOptions(...options: Array<Partial<Options>>): Options {
        return defaultsDeep({
            description: '',
            required   : false,
            validate   : () => true,
            transform  : (val) => val,
        }, ...options);
    }


    export const optionKeys: (keyof Options)[] = [ 'description', 'defaultValue', 'required', 'validate', 'transform' ];
    export const switchesKeys: Switches        = [ 'required' ];

    export const isSwitches        = (value: any): value is Switches => Array.isArray(value) && includeAny(value, switchesKeys);
    export const isOptions         = (value: any): value is Options => typeof value === 'object' && includeAny(Object.keys(value), optionKeys);
    export const isDescription     = (value: any): value is string => typeof value === 'string';
    export const isRequired        = (value: any): value is boolean => typeof value === 'boolean';
    export const isDirectFunction  = (value: any): value is Function => typeof value === 'function';
    export const isCommandFunction = (value: any): value is string => typeof value === 'string';
    export const defaultMetadata   = (propertyKey, parameterIndex) => ({
        propertyKey,
        parameterIndex,
        type   : String,
        options: {},
    });

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

    export let argument: Arguments.Decorator = (...args: any[]): ParameterDecorator => {
        let options: Arguments.Options = Arguments.resolveDecoratorParameters(args);
        return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
            options = createOptions(options, {
                method: propertyKey.toString(),
                index : parameterIndex,
                type  : rget('design:type', target, propertyKey),
            });
            meta(target).set(`arguments.${parameterIndex}`, options);
        };
    };
}

export const argument: Arguments.Decorator = Arguments.argument;
// endregion

// region Options :: Decorator, Types, Utility

export namespace Options {


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
    export const createMetadata    = (propertyKey, type, options: Options): MetaData => ({ propertyKey, type, options });


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

}

export const option: Options.Decorator = Options.option;
// endregion

// region Parser :: Builder and Executor

export class Parser<T extends Commands.RuntimeCommand> {
    name: string;
    meta: any;
    command: T;

    constructor(public target: ConstructorTypeOf<T>) {
        this.command = new target;
    }

    public parse(argv): T {
        const command = this.prepareCommand(argv);
        // await command[ '__handle' ]();
        return command;
    }

    public prepareCommand(argsv): T {
        // parse the command line, parse the options, filter the arguments out
        let { error, argv: options } = this.parseOptions(argsv);
        // parse the filtered arguments
        let args                     = this.prepareArguments(options._);
        // remove the unprepared arguments from the options
        delete options._;

        this.command = new this.target;

        // apply options
        Object.keys(options).forEach(key => {
            this.command[ key ] = options[ key ];
        });

        // apply command handler
        // apply arguments
        const data                 = meta(this.target).get();
        let handler                = data.command.handler;
        this.command[ '__handle' ] = async () => {
            if ( Commands.isHandlerFunction(handler) ) {
                return await handler(...args);
            } else if ( Commands.isHandlerName(handler) ) {
                return await this.command[ handler ](...args);
            }
            throw Error('Not a valid handler');
        };
        return this.command;
    }

    public parseOptions(argv) {
        let data                        = meta(this.target).get();
        let parserOptions: YargsOptions = this.getDefaultParserOptions();

        Object.keys(data.options).forEach(key => {
            let o = data.options[ key ];
            try {
                let type = typeof o.type();
                (parserOptions[ type ] || [ type ]).push(key);
            } catch ( e ) {
                console.error(e);
            }

            parserOptions.alias[ key ] = o.short;
            if ( o.array ) {
                parserOptions.array[ key ] = true;
            }
            parserOptions.default[ key ] = o.defaultValue || this.command[ key ];
            parserOptions.coerce[ key ]  = (arg: any) => {
                if ( arg === undefined && o.required === false ) {
                    return arg;
                }
                arg = o.type(arg);
                if ( o.validate ) {
                    let result;
                    if ( Options.isDirectFunction(o.validate) ) {
                        result = o.validate(arg);
                    } else if ( Options.isCommandFunction(o.validate) ) {
                        result = this.command[ o.validate ](key);
                    }
                    if ( result !== true ) {
                        throw Error(result);
                    }
                }

                if ( o.arguments > 0 && o.transform ) {
                    if ( Options.isDirectFunction(o.transform) ) {
                        arg = o.transform(arg);
                    } else if ( Options.isCommandFunction(o.transform) ) {
                        arg = this.command[ o.transform ](arg);
                    }
                }

                return arg;
            };
        });

        try {
            return detailed(argv, parserOptions);
        } catch ( e ) {
            console.error(e);
        }

    }

    public prepareArguments(args: any[]) {
        let data = meta(this.target).get();
        data.arguments.forEach((o, index) => {
            let value = args[ index ];
            let type  = typeof o.type();
            value     = o.type(value);
            if ( value === undefined && o.required === false ) {
                return value;
            }
            // validate
            if ( o.validate ) {
                let result;
                if ( Options.isDirectFunction(o.validate) ) {
                    result = o.validate(value);
                } else if ( Options.isCommandFunction(o.validate) ) {
                    result = this.command[ o.validate ](value);
                }
                if ( result !== true ) {
                    throw Error(result);
                }
            }

            // transform
            if ( o.transform ) {
                if ( Options.isDirectFunction(o.transform) ) {
                    value = o.transform(value);
                } else if ( Options.isCommandFunction(o.transform) ) {
                    value = this.command[ o.transform ](value);
                }
            }

            return value;
        });
        return args;
    }

    protected getDefaultParserOptions(): YargsOptions {
        return {
            alias  : {},
            array  : [],
            boolean: [],
            config : [],
            default: {},
            // config       : [ 'settings' ],
            // default      : {
            //     settings: resolve(process.cwd(), '.config.json'),
            // },
            coerce       : {},
            count        : [],
            envPrefix    : undefined,
            narg         : {},
            normalize    : [],
            string       : [],
            number       : [],
            configuration: {
                'parse-numbers': true,
            },
        };
    }
}

//
//
// export async function run<T>(target: ConstructorTypeOf<T>, argv?: string | string[]) {
//     let parser   = new Parser(target);
//     const result = await parser.run(argv);
//     return ExitCode.OK;
// }

// endregion


// region Meta :: Decorator and Reflection
// const r = Reflect;
// export class Meta {
//     public static metas: Meta[] = [];
//
//     public static findMeta(where: any): Meta | undefined {
//         return this.metas.find(meta => {
//             let keys = Object.keys(where);
//             for ( const key of keys ) {
//                 if ( meta[ key ] === where[ key ] ) {
//                     return meta;
//                 }
//             }
//         });
//     }
//
//     public name;
//     private _prototype: any;
//     private _target: Object;
//     public get target() {return this._target; }
//
//
//     protected constructor(_target: Object) {
//         let name = Object.getPrototypeOf(_target).name;
//         let a    = name;
//         if ( r.hasMetadata(new.target.name, _target) ) {
//             throw new Error('Cant bind 2 ' + new.target.name + ' to a target');
//         }
//         this._target    = _target;
//         this._prototype = Object.getPrototypeOf(_target);
//         this.name       = _target?.constructor?.name || this._prototype?.constructor?.name;
//
//         r.defineMetadata(_target, 'meta', this);
//         new.target.metas.push(this);
//     }
//
//     public static binding(target: Object): Meta {
//         if ( this.isBound(target) ) {
//             return this.getBinding(target);
//         }
//         return this.bind(target);
//     }
//
//     private static bind(target: Object): Meta { return new this(target); }
//
//     private static isBound(target: Object): boolean { return r.hasMetadata(this.name, target); }
//
//     private static getBinding(target: Object): Meta { return r.getMetadata(this.name, target); }
//
//     protected designType<T>(propertyKey): DesignType<T> { return r.getOwnMetadata('design:type', this._target, propertyKey); }
//
//     protected designTypeName<T>(propertyKey): DesignType<T> { return this.designType(propertyKey)[ 'name' ].toLowerCase(); }
//
//     public option(propertyKey, args: any[]) {
//         let config: Options.Options = {};
//         args.forEach((value, i) => {
//             if ( Options.isShort(args[ i ]) ) {
//                 config.short = args[ i ];
//             } else if ( Options.isSwitch(args[ i ]) ) {
//                 args[ i ].forEach(name => config[ name ] = true);
//             } else if ( Options.isOptions(args[ i ]) ) {
//                 config = { ...config, ...args[ i ] };
//             }
//         });
//         let metaData: Options.MetaData = {
//             propertyKey,
//             options: config,
//             type   : this.designType(propertyKey),
//         };
//         this.set('options', metaData, propertyKey);
//     }
//
//     public argument(propertyKey, parameterIndex, args: any[]) {
//         let config: Arguments.Options = {};
//         args.forEach((value, i) => {
//             if ( Arguments.isSwitch(args[ i ]) ) {
//                 args[ i ].forEach(name => config[ name ] = true);
//             } else if ( Arguments.isOptions(args[ i ]) ) {
//                 config = { ...config, ...args[ i ] };
//             }
//             if ( Arguments.isDescription(args[ i ]) ) {
//                 config.description = args[ i ];
//             }
//             if ( Arguments.isRequired(args[ i ]) ) {
//                 config.required = args[ i ];
//             }
//         });
//         let types                        = r.getMetadata('design:paramtypes', this._target, propertyKey);
//         let type                         = types[ parameterIndex ];
//         let metaData: Arguments.MetaData = {
//             propertyKey,
//             parameterIndex,
//             type,
//             options: config,
//         };
//         this.set('arguments', metaData, propertyKey, parameterIndex);
//     }
//
//     public command(metaData) {
//         this.set('command', metaData);
//     }
//
//     protected set(category: 'command' | 'options' | 'arguments', data, propertyKey?, parameterIndex?) {
//         let metaData: MetaData = r.getMetadata('data', this.target) || {
//             command  : {},
//             options  : {},
//             arguments: {},
//         };
//
//         if ( category === 'command' ) {
//             let metaData: MetaData = r.getMetadata('data', this.target);
//             metaData.command       = { ...metaData.command, ...data };
//             return this.defineMetaDataData(metaData);
//         }
//
//         if ( category === 'options' ) {
//             metaData.options[ propertyKey ] = {
//                 ...Options.defaultMetadata(propertyKey),
//                 ...data,
//             };
//             return this.defineMetaDataData(metaData);
//         }
//
//         if ( category === 'arguments' ) {
//
//             (metaData.arguments[ propertyKey ] = metaData.arguments[ propertyKey ] || [])[ parameterIndex ] = {
//                 ...Arguments.defaultMetadata(propertyKey, parameterIndex),
//                 ...data,
//             };
//
//             return this.defineMetaDataData(metaData);
//         }
//         throw Error('Wrong category: ' + category);
//         // set(metaData, category, { data, propertyKey, parameterIndex });
//         //r.defineMetadata('data', metaData, this.target);
//     }
//
//     protected defineMetaDataData(metaData: any): this {
//         let old = r.getMetadata('data', this.target);
//         let a   = old;
//         r.defineMetadata('data', metaData, this.target);
//         return this;
//     }
//
//     public read(): MetaData {
//         return r.getMetadata('data', this.target);
//     }
// }

//const mb = (target: Object) => Meta.binding(target);

// endregion
