import { ContainerModule, interfaces } from 'inversify';
import { ConsoleTransportOptions, LeveledLogMethod, LoggerInstance, TransportInstance } from 'winston';

import { Parser } from '@radic/console-colors';
import { Log, LogLevel } from './interfaces';
import * as util from 'util';
import { container } from '../../core/Container';
import { injectable } from '../../core/Container';

export * from './interfaces'

export function logConsoleTransportFormatter(options: ConsoleTransportOptions) {
    let meta   = options[ 'meta' ];
    let output = '';
    if ( meta !== null && meta !== undefined ) {
        if ( meta && meta instanceof Error && meta.stack ) {
            meta = meta.stack;
        }
        if ( typeof meta !== 'object' ) {
            output += '' + meta;
        }
        else if ( Object.keys(meta).length > 0 ) {
            if ( typeof options.prettyPrint === 'function' ) {
                output += '' + options.prettyPrint(meta);
            } else if ( options.prettyPrint ) {
                output += '' + util.inspect(meta, false, options.depth || null, options.colorize);
            } else if (
                options.humanReadableUnhandledException
                && Object.keys(meta).length === 5
                && meta.hasOwnProperty('date')
                && meta.hasOwnProperty('process')
                && meta.hasOwnProperty('os')
                && meta.hasOwnProperty('trace')
                && meta.hasOwnProperty('stack') ) {

                //
                // If meta carries unhandled exception data serialize the stack nicely
                //
                var stack = meta.stack;
                delete meta.stack;
                delete meta.trace;
                output += '' + exports.serialize(meta);

                if ( stack ) {
                    output += stack.join('\n');
                }
            } else {
                output += '' + exports.serialize(meta);
            }
        }
    }

    return output;

}

export const logLevels: string[] = [ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]
export let logLevel                         = {};
logLevels.forEach((level, index) => logLevel[ level ] = index)

@injectable()
export class WinstonLog implements Log {
    // for cli levels
    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    help: LeveledLogMethod;
    data: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    prompt: LeveledLogMethod;
    verbose: LeveledLogMethod;
    input: LeveledLogMethod;
    silly: LeveledLogMethod;

    // for syslog levels only
    emerg: LeveledLogMethod;
    alert: LeveledLogMethod;
    crit: LeveledLogMethod;
    warning: LeveledLogMethod;
    notice: LeveledLogMethod;

    get logger(): LoggerInstance { return container.get<LoggerInstance>('cli.log.logger')}

    setLogLevel(level: LogLevel) {
        if ( typeof level === 'number' ) {
            level = logLevels[ level ]
        }
        this.logger.level = level.toString();
    }

    setVerbosity(verbosity: number) {
        let level = logLevels.indexOf('info') + verbosity;
        if ( level > logLevels.length - 1 ) {
            level = logLevels.length - 1;
        }
        this.setLogLevel(<LogLevel> level);
    }
}

logLevels.forEach(level => WinstonLog.prototype[ level ] = function (...args: any[]) {
    let log = container.get<LoggerInstance>('cli.log.logger')
    log[ level ].call(log, args);
})
@injectable()
export class NullLog extends WinstonLog {
    get logger(): LoggerInstance { throw new Error('No logger instance for NullLog')}
}

logLevels.forEach(level => NullLog.prototype[ level ] = (...args: any[]) => null)

export const nullLogModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    bind<NullLog>('cli.log').to(NullLog).inSingletonScope();
});

export const logModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    const winston                        = require('winston')
    const { Logger, config, transports } = winston;
    let logColors                        = {};
    logLevels.forEach((level, index) => {
        logColors[ level ] = config.cli.colors[ level ] ? config.cli.colors[ level ] : config.syslog.colors[ level ]
    })
    winston.addColors(logColors)
    const {figures} = require('../output/figures')
    const levelIcons = {
        error  : figures.circleCross,
        warn   : figures.warning,
        alert  : figures.circlePipe,
        notice : '{bold}!{/bold}',
        help   : figures.circleQuestionMark,
        info   : figures.info,
        verbose: figures.info.repeat(2),
        data   : figures.info.repeat(3),
        debug  : figures.hamburger,
        silly  : figures.smiley
    }

    let parser: Parser = new Parser;

    const logTransports: TransportInstance[] = [
        new (transports.Console)({
            // json       : true,
            colorize   : true,
            prettyPrint: true,

            // timestamp  : true,
            showLevel: true,
            formatter: function (options: ConsoleTransportOptions) {
                let cli = container.get<any>('cli')
                if ( container.get<any>('cli.helpers').isEnabled('output') ) {
                    const out        = container.get<any>('cli.helpers.output')
                    options.colorize = out.config.colors
                    parser           = out.parser;
                }
                // Return string will be passed to logger.
                let message = options[ 'message' ] ? options[ 'message' ] : ''
                let color   = config.syslog.colors[ options.level ] || config.cli.colors[ options.level ]
                let level   = options.level;
                if ( cli.config('log.useLevelIcons') && options.level in levelIcons ) {
                    level = levelIcons[ options.level ] + ' ' + level
                }
                if ( options.colorize ) {
                    message = parser.parse(message);
                    level   = parser.parse(`{${color}}${level}{/${color}}`)
                }
                let meta: any  = logConsoleTransportFormatter(options);
                let metaPrefix = meta.length > 200 ? '\n' : '\t'
                return `${level} :: ${message} ${metaPrefix}${meta}`
                // level           : 'info',
                // handleExceptions: true,
                // label: string|null;
                // formatter(opts?:ConsoleTransportOptions) : string{
                //     return opts['message'];
                // }
            }
        })
    ];

    bind<TransportInstance[]>('cli.log.transports').toConstantValue(logTransports)
    if ( isBound('cli.log.logger') ) {
        unbind('cli.log.logger')
    }
    bind<LoggerInstance>('cli.log.logger').toConstantValue((() => {
        return new Logger(<any>{
            level      : 'info',
            rewriters  : [ (level, msg, meta) => {
                return meta;
            } ],
            levels     : logLevel,
            exitOnError: false,
            transports : logTransports
            // exitOnError: false
        });
    })());

    if ( isBound('cli.log') ) {
        unbind('cli.log')
    }
    bind<Log>('cli.log').to(WinstonLog).inSingletonScope();
})
