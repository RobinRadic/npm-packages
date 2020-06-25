import { Erasers }                                                   from './erase';
import { Movers }                                                    from './move';
import { Data, Options }                                             from 'columnify';
// noinspection ES6UnusedImports
import ProgressBar, { ProgressBarOptions as BaseProgressBarOptions } from 'progress';
import { OutputConfig }                                              from '../interfaces';

import CliTable3, { Table, TableConstructorOptions } from 'cli-table3';
import { Output }                                    from '../Output';

function makeDoProxy(target, write, returnValue) {
    const proxy = new Proxy(target, {
        get(target: any, p: PropertyKey, receiver: any): any {
            return (...args) => {
                let value = target[ p ];
                if ( typeof value === 'function' ) {
                    value = value(...args);
                }
                write(value);
                return returnValue;
            };
        },
    });
    return proxy as any;
}


export class UiBase {
    constructor(protected ui: Ui) {}

    protected get stdout() { return this.ui.output.stdout;}

    get move(): UiMove {return this.ui.move;}

    get erase(): UiErase {return this.ui.erase;}

    get text(): UiText {return this.ui.text;}
}

export class UiMove extends UiBase {
    protected _proxy = makeDoProxy(this.get, this.stdout.write.bind(this.stdout), this);

    get get(): Movers { return require('./move').move; }

    up        = (num?: number): this => this._proxy.up(num);
    down      = (num?: number): this => this._proxy.down(num);
    right     = (num?: number): this => this._proxy.right(num);
    left      = (num?: number): this => this._proxy.left(num);
    top       = (): this => this._proxy.top();
    bottom    = (): this => this._proxy.bottom();
    lineBegin = (): this => this._proxy.lineBegin();
    lineEnd   = (): this => this._proxy.lineEnd();
    to        = (x: number, y: number): this => this._proxy.to(x, y);
    lines     = (num: number): this => this._proxy.lines(num);
}

export class UiErase extends UiBase {
    protected _proxy = makeDoProxy(this.get, this.stdout.write.bind(this.stdout), this);

    get get(): Erasers { return require('./erase').erase; }

    screen      = (): this => this._proxy.screen();
    screenLeft  = (): this => this._proxy.screenLeft();
    screenRight = (): this => this._proxy.screenRight();
    line        = (): this => this._proxy.line();
    lineLeft    = (): this => this._proxy.lineLeft();
    lineRight   = (): this => this._proxy.lineRight();
}

export class UiText extends UiBase {

    truncate(input: string, columns: number, position?: 'start' | 'middle' | 'end'): string { return require('cli-truncate')(...arguments);}

    wrap(input: string, columns: number, options?: { hard?: boolean; trim?: boolean; wordWrap?: boolean; }): string { return require('wrap-ansi')(...arguments);}

    slice(inputu: string, beginSlice: number, endSlice?: number): string { return require('slice-ansi')(...arguments);}

    columns(data: Data, options: Options): string { return require('columnify')(...arguments); }

}


export interface ProgressBarOptions extends Partial<BaseProgressBarOptions> {
    format?: string
    output?: OutputConfig
}

export class Progress {
    constructor(protected output: Output) {}

    bar(options: ProgressBarOptions = {}) {

        let output;
        if ( 'output' in options ) {
            output = options.output;
            delete options.output;
        }

        let border = this.output.parse(`{cyan}${this.output.figures.square}{/cyan}`);
        let format = `${border}{blue}:bar{/blue}${border} :current/:total`;
        if ( 'format' in options ) {
            format = options.format;
            delete options.format;
        }

        format = this.output.parse(format, output);

        const bar = new ProgressBar(format, {
            total     : 100,
            stream    : this.output.stdout,
            complete  : this.output.figures.square,
            incomplete: ' ',
            ...options,
        });
        return bar;
    }
}

export interface Ui {

}

export class Ui {
    constructor(readonly output: Output) {}

    public readonly progress: Progress;
    public readonly move: UiMove   = new UiMove(this);
    public readonly erase: UiErase = new UiErase(this);
    public readonly text: UiText   = new UiText(this);

    public get height() { return require('term-size')().rows || 0; }

    public get width() { return require('term-size')().columns || 0; }

    public get Table(): CliTable3 { return require('cli-table3'); }

    public table(opts?: TableConstructorOptions, borderStyle: 'default' | 'borderless' = 'default'): Table {
        if ( borderStyle === 'borderless' ) {
            opts.chars = { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '', 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '', 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '', 'right': '', 'right-mid': '', 'middle': ' ' };
        }
        return new this.Table(opts);
    }

}
