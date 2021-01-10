import { meta }                             from '../util';
import { ConstructorTypeOf, Exit }          from '../types';
import { isHandlerFunction, isHandlerName } from './commands';
import { detailed, Options as YargsOptions }   from 'yargs-parser';
import { isCommandFunction, isDirectFunction } from './options';

export interface ParsedCommand {
    __handle(): Promise<Exit>
}

export class Parser<T,P=T&ParsedCommand> {
    name: string;
    meta: any;
    command: P;

    constructor(public target: ConstructorTypeOf<T>) {
        this.command = (new target) as any as P;
    }

    public parse(argv): P {
        const command = this.prepareCommand(argv);
        // await command[ '__handle' ]();
        return command;
    }

    public prepareCommand(argsv): P {
        // parse the command line, parse the options, filter the arguments out
        let { error, argv: options } = this.parseOptions(argsv);
        // parse the filtered arguments
        let args                     = this.prepareArguments(options._);
        // remove the unprepared arguments from the options
        delete options._;

        // apply options
        Object.keys(options).forEach(key => {
            this.command[ key ] = options[ key ];
        });

        // apply command handler
        // apply arguments
        const data                 = meta(this.target).get();
        let handler                = data.command.handler;
        this.command[ '__handle' ] = async () => {
            if ( isHandlerFunction(handler) ) {
                return await handler(...args);
            } else if ( isHandlerName(handler) ) {
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
                    if ( isDirectFunction(o.validate) ) {
                        result = o.validate(arg);
                    } else if ( isCommandFunction(o.validate) ) {
                        result = this.command[ o.validate ](key);
                    }
                    if ( result !== true ) {
                        throw Error(result);
                    }
                }

                if ( o.arguments > 0 && o.transform ) {
                    if ( isDirectFunction(o.transform) ) {
                        arg = o.transform(arg);
                    } else if ( isCommandFunction(o.transform) ) {
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
                if ( isDirectFunction(o.validate) ) {
                    result = o.validate(value);
                } else if ( isCommandFunction(o.validate) ) {
                    result = this.command[ o.validate ](value);
                }
                if ( result !== true ) {
                    throw Error(result);
                }
            }

            // transform
            if ( o.transform ) {
                if ( isDirectFunction(o.transform) ) {
                    value = o.transform(value);
                } else if ( isCommandFunction(o.transform) ) {
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
