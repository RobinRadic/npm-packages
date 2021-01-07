export function rc(options) {

}

export namespace rc {

    export let command: CommandDecorator;

    export interface CommandDecorator {
        (name, options?): ClassDecorator
    }


    export let argument: ArgumentDecorator;

    export interface ArgumentDecorator {
        (name, options?): ClassDecorator & DecoratorModifiers<ClassDecorator>
    }

    export interface DecoratorModifiers<Decorator> {
        string: Decorator & DecoratorModifiers<Decorator>
        number: Decorator & DecoratorModifiers<Decorator>
        bool: Decorator & DecoratorModifiers<Decorator>
        require: Decorator & DecoratorModifiers<Decorator>

        default(value): Decorator & DecoratorModifiers<Decorator>
    }


    export class options {
        static option(short: option.Character, options?: option.DecoratorOptions): PropertyDecorator & option.OptionModifiers
        static option(short: option.Character, defaultValue?: any, options?: option.DecoratorOptions): PropertyDecorator & option.OptionModifiers
        static option(...args): any {
            return;
        }
    }

    export let option = options.option;

    export namespace option {
        export type Character = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
        export type Type = 'string' | 'string[]' | 'number' | 'number[]'


        export interface DecoratorOptions {
            defaultValue?: string
            array?: boolean
        }

        export interface Decorator {
            (short: Character, options?: DecoratorOptions): PropertyDecorator & OptionModifiers

            (short: Character, defaultValue?: any, options?: DecoratorOptions): PropertyDecorator & OptionModifiers
        }

        export interface OptionModifiers {

        }
    }


}


export default rc;


