import { Options as CommandOptions }  from './parsing/commands';
import { Options as OptionOptions }   from './parsing/options';
import { Options as ArgumentOptions } from './parsing/arguments';

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

export type ConstructorTypeOf<T> = new (...args: any[]) => T;


export namespace Exit {
    export const code = (exit: Exit) => Exit[ exit ];

}

export enum Exit {
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
    command: CommandOptions
    options: Record<string, OptionOptions>
    arguments: Record<string, Array<ArgumentOptions>>
}
