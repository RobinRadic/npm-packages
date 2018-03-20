///<reference path="declarations.d.ts"/>

import { figures } from './lib/figures'
import * as truncate from 'cli-truncate'
import * as wrap from 'wrap-ansi'
import * as slice from 'slice-ansi'
import * as widest from 'widest-line'
import * as width from 'string-width'
import { Figures, OutputOptions, TruncateOptions, WrapOptions } from './lib/interfaces';
import { Colors, Parser } from '@radic/console-colors';
import { inspect } from 'util';


export class OutputUtil {

    get useColors(): boolean {return this.out.options.colors }

    get figures(): Figures { return figures}

    constructor(protected out: Output) { }

    truncate(input: string, columns: number, options?: TruncateOptions): string { return truncate.apply(truncate, arguments)}

    wrap(input: string, columns: number, options?: WrapOptions): string { return wrap.apply(wrap, arguments)}

    slice(inputu: string, beginSlice: number, endSlice?: number): string { return slice.apply(slice, arguments)}

    widest(input: string): number { return widest.apply(widest, arguments)}

    width(input: string): number { return width.apply(width, arguments)}


}

export class Output {
    constructor(options: OutputOptions = {}) {
        this.options = {
            ...this.options,
            ...options
        }
        this._parser = new Parser()
        this.util    = new OutputUtil(this);
        // let promptNames = Object.keys(prompts);
        // if ( ! promptNames.includes('autocomplete') ) registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
        // if ( ! promptNames.includes('datetime') ) registerPrompt('datetime', require('inquirer-datepicker-prompt'))
    }

    protected _parser: Parser
    protected macros: { [name: string]: (...args: any[]) => string }
    public options: OutputOptions = {
        enabled: true,
        colors : true,
        inspect: { showHidden: true, depth: 10 }
    }

    public util: OutputUtil;
    public stdout: NodeJS.WriteStream = process.stdout

    get parser(): Parser { return this._parser }

    get colors(): Colors { return this._parser.colors; }

    get nl(): this { return this.write('\n') }

    bind(name: string, fn: (this: Output, ...args) => any): this {
        this.macros[ name ] = fn;
        return this;
    }

    macro<T>(name: string, ...args): T { return this.macros[ name ].apply(this, args); }

    hasMacro(name: string): boolean { return this.macros[ name ] !== undefined }

    parse(text: string, force?: boolean): string {return this._parser.parse(text) }

    clean(text: string): string { return this._parser.clean(text)}

    write(text: string): this {
        if ( this.options.colors ) {
            text = this.parse(text);
        } else {
            text = this.clean(text);
        }
        this.stdout.write(text);
        return this;
    }

    writeln(text: string = ''): this { return this.write(text + '\n') }

    line(text: string = ''): this { return this.write(text + '\n')}

    dump(...args: any[]): this {
        this.options.inspect.colors = this.options.colors
        args.forEach(arg => this.line(inspect(arg, this.options.inspect)));
        return this
    }

    error(msg: string, ...args: any[]): this {
        if ( this.hasMacro('error') ) {
            return this.macro('error', [ msg ].concat(args))
        }

        return this
            .line(`{red.bold}${figures.circleCross}{/bold} ${msg}{reset}`)
            .dump(...args);
    }

    warn(msg: string, ...args: any[]): this {
        if ( this.hasMacro('error') ) {
            return this.macro('error', [ msg ].concat(args))
        }

        return this
            .line(`{yellow.bold}${figures.warning}{/bold} ${msg}{reset}`)
            .dump(...args);
    }

    info(msg: string, ...args: any[]): this {
        if ( this.hasMacro('error') ) {
            return this.macro('error', [ msg ].concat(args))
        }

        return this
            .line(`{cyan.bold}${figures.info}{/bold} ${msg}{reset}`)
            .dump(...args);
    }



}