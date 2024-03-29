import { ServiceProvider } from '@radic/shared';
import winston, { LogCallback, LoggerOptions } from 'winston';
import { LogLevelColors, LogLevels } from './levels';
import * as Transport from 'winston-transport';
import { Bindings } from '@radic/core';
import { Format } from 'logform';
declare type WinstonLogLevels = 'error' | 'warn' | 'help' | 'data' | 'info' | 'debug' | 'prompt' | 'http' | 'verbose' | 'input' | 'silly' | 'emerg' | 'alert' | 'crit' | 'warning' | 'notice';
export interface Logger extends Omit<winston.Logger, WinstonLogLevels> {
    error: winston.LeveledLogMethod;
    warn: winston.LeveledLogMethod;
    success: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;
    verbose: winston.LeveledLogMethod;
    vverbose: winston.LeveledLogMethod;
    vvverbose: winston.LeveledLogMethod;
    debug: winston.LeveledLogMethod;
    log: LogMethod;
}
interface LogMethod extends winston.LogMethod {
    (level: keyof LogLevels, message: string, callback: LogCallback): Logger;
    (level: keyof LogLevels, message: string, meta: any, callback: LogCallback): Logger;
    (level: keyof LogLevels, message: string, ...meta: any[]): Logger;
    (level: keyof LogLevels, message: any): Logger;
}
export interface LogConfiguration extends Omit<LoggerOptions, 'level' | 'transports'> {
    level?: keyof LogLevels;
    levels?: LogLevels;
    colors?: LogLevelColors;
    transports?: Transport[];
}
declare module '@radic/core/types/Foundation/Application' {
    interface Bindings {
        log: Logger;
    }
    interface Application {
        log: Logger;
    }
}
declare module '@radic/core/types/types/config' {
    interface Configuration {
        log?: LogConfiguration;
    }
}
export declare type FormatWrap<T = any> = (opts?: T) => Format;
export declare class LogServiceProvider extends ServiceProvider {
    load(): void;
    getFormat(): Format;
    register(): void;
}
export declare const log: (proto: any, key: string) => void;
export declare type log = Bindings['log'];
export {};
