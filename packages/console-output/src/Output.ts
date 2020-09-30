import { merge }                                                                                      from 'lodash';
import { ColumnsOptions, Figures, IParser, IParserConstructor, OutputOptions, TreeData, TreeOptions } from './interfaces';
import { inspect }                                                                                    from 'util';
import { OutputUtil }                                                                                 from './OutputUtil';
import * as Table                                                                                     from 'cli-table2';
import { TableConstructorOptions }                                                                    from 'cli-table2';
// import { Colors, Parser } from '@radic/console-colors';
import { Diff }                                                                                       from './utils/diff';
import sparkly, { Options as SparklyOptions }                                                         from 'sparkly';
import { highlight, HighlightOptions }                                                                from 'cli-highlight';
import MultiSpinner, { Multispinner, MultispinnerOptions, MultispinnerSpinners }                      from 'multispinner';
import { NodeNotifier, Notification, NotificationCallback }                                           from 'node-notifier';

import columnify from 'columnify';
import { Ui }    from './ui';

import ora from 'ora';

import archy from 'archy';

import beeper                     from 'beeper';
import { Colors, ColorsParser }   from './colors';
import { figures, FiguresParser } from './figures';
import { Writable }               from 'stream';

export class Output {
    public parsers: Map<string, IParserConstructor>;
    public loaded_parsers: Map<string, IParser>;
    protected macros: { [ name: string ]: (...args: any[]) => string };
    public options: OutputOptions               = {};
    public static defaultOptions: OutputOptions = {
        quiet         : false,
        parsers       : {
            colors : true,
            figures: true,
        },
        resetOnNewline: true,
        inspect       : { showHidden: true, depth: 10 },
        styles        : {
            title   : 'yellow bold',
            subtitle: 'yellow',

            success: 'green lighten 20 bold',
            warning: 'orange lighten 20 bold',
            error  : 'red lighten 20 bold',

        },
        tableStyle    : {
            FAT : {
                'top'         : '═',
                'top-mid'     : '╤',
                'top-left'    : '╔',
                'top-right'   : '╗',
                'bottom'      : '═',
                'bottom-mid'  : '╧',
                'bottom-left' : '╚',
                'bottom-right': '╝',
                'left'        : '║',
                'left-mid'    : '╟',
                'mid'         : '─',
                'mid-mid'     : '┼',
                'right'       : '║',
                'right-mid'   : '╢',
                'middle'      : '│',
            },
            SLIM: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
            NONE: {
                'top'     : '', 'top-mid': '', 'top-left': '', 'top-right': ''
                , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
                , 'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': ''
                , 'right' : '', 'right-mid': '', 'middle': ' ',
            },
        },
    };

    public util: OutputUtil;
    public ui: Ui;
    public figures: Figures;
    public stdout: Writable = process.stdout;


    get colors(): Colors { return (this.loadParsers().get('colors') as ColorsParser).colors; }

    get nl(): this { return this.write('\n'); }

    constructor(options: OutputOptions = {}) {
        this.options        = merge({}, new.target.defaultOptions, options);
        this.util           = new OutputUtil(this);
        this.ui             = new Ui(this);
        this.figures        = figures;
        this.parsers        = new Map();
        this.loaded_parsers = new Map();
        this.setDefaultParsers();
    }

    protected setDefaultParsers() {
        this.parsers
            .set('colors', ColorsParser)
            .set('figures', FiguresParser)
        ;
    }

    mergeOptions(options: OutputOptions = {}) {
        this.options = merge({}, this.options, options);
        return this;
    }

    protected loadParsers() {
        Array.from(this.parsers.keys())
            .filter(key => !this.loaded_parsers.has(key))
            .filter(key => key in this.options.parsers && this.options.parsers[ key ] !== false)
            .forEach(key => {
                const Parser = this.parsers.get(key);
                this.loaded_parsers.set(key, new Parser(this));
            });
        return this.loaded_parsers;
    }

    parse(text: string, force?: boolean): string {
        this.loadParsers().forEach(parser => text = parser.parse(text));
        return text;
    }

    clean(text: string): string {
        this.loadParsers().forEach(parser => text = parser.clean(text));
        return text;
    }

    write(text: string): this {
        text = this.parse(text);
        this.stdout.write(text);
        return this;
    }

    writeln(text: string = ''): this {
        this.write(text);
        if ( this.options.resetOnNewline ) {
            this.write('{reset}');
        }
        this.write('\n');
        return this;
    }

    line(text: string = ''): this { return this.writeln(text);}

    dump(...args: any[]): this {
        args.forEach(arg => this.line(inspect(arg, this.options.inspect)));
        return this;
    }

    macro<T extends (...args: any[]) => string>(name: string): T {
        return <T>((...args: any[]): string => {
            return this.macros[ name ].apply(this, args);
        });
    }

    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any {
        this.macros[ name ] = macro;
        return this;
    }

    diff(o: object, o2: object): Diff { return new Diff(o, o2); }

    spinner(text: string = '', options: ora.Options = {}): ora.Ora {
        const spinner = ora(options);
        spinner.text  = text;
        return spinner;
    }

    spinners: any[];

    beep(val?: number, cb?: Function): this {
        beeper(val);
        return this;
    }

    tree(obj: TreeData, opts: TreeOptions = {}, returnValue: boolean = false): string | this {
        let prefix = opts.prefix;
        delete opts.prefix;
        let tree = archy(obj, prefix, opts);
        return returnValue ? tree : this.line(tree);
    }

    protected modifiedTable: boolean = false;

    /**
     * Integrates the color parser for cells into the table
     */
    protected modifyTablePush() {
        if ( this.modifiedTable ) return;
        const _push                 = Table.prototype.push;
        let self                    = this;
        Table.prototype[ 'addRow' ] = function (row: any[]) {
            this.push(
                row.map(col => {
                    if ( typeof (col) === 'string' ) {
                        col = self.parse(col);
                    }
                    return col;
                }),
            );
        };
        this.modifiedTable          = true;
    }

    /**
     * Create a table
     * @param {CliTable2.TableConstructorOptions | string[]} options Accepts a options object or header names as string array
     * @returns {any[]}
     */
    table(options: TableConstructorOptions | string[] = {}): Table.Table {
        this.modifyTablePush();
        new this.ui.Table({});
        return new (Table as any)(
            Array.isArray(options)
            ? { head: <string[]>options }
            : <TableConstructorOptions>options,
        );
    }

    columns(data: any, options: ColumnsOptions = {}, ret: boolean = false) {
        let defaults: ColumnsOptions = {
            minWidth        : 20,
            maxWidth        : 120,
            preserveNewLines: true,
            columnSplitter  : ' | ',
        };
        let iCol: number             = 0;
        if ( Array.isArray(data) && typeof (data[ 0 ]) === 'object' ) {
            iCol = Object.keys(data[ 0 ]).length;
        }
        if ( process.stdout.isTTY && iCol > 0 ) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        let res = columnify(data, merge({}, defaults, options));
        if ( ret ) return res;
        this.writeln(res);
    }

    notify(options: Notification, cb?: NotificationCallback): NodeNotifier {
        return require('node-notifier').notify(options, cb);
    }

    sparkly(numbers: Array<number | ''>, options?: SparklyOptions, ret: boolean = false): string | this {
        let s = sparkly(numbers, options);
        return ret ? s : this.writeln(s);
    }

    highlight(code: string, options?: HighlightOptions, ret: boolean = false): string | this {
        let h = highlight(code, options);
        return ret ? h : this.writeln(h);
    }

    multispinner(spinners: MultispinnerSpinners, opts?: MultispinnerOptions): Multispinner {
        return new MultiSpinner(spinners, opts);
    }
}
