/// <reference types="winston" />
import { ContainerModule } from 'inversify';
import { ConsoleTransportOptions, LeveledLogMethod, LoggerInstance } from 'winston';
import { Log, LogLevel } from './interfaces';
export * from './interfaces';
export declare function logConsoleTransportFormatter(options: ConsoleTransportOptions): string;
export declare const logLevels: string[];
export declare let logLevel: {};
export declare class WinstonLog implements Log {
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
    emerg: LeveledLogMethod;
    alert: LeveledLogMethod;
    crit: LeveledLogMethod;
    warning: LeveledLogMethod;
    notice: LeveledLogMethod;
    readonly logger: LoggerInstance;
    setLogLevel(level: LogLevel): void;
    setVerbosity(verbosity: number): void;
}
export declare class NullLog extends WinstonLog {
    readonly logger: LoggerInstance;
}
export declare const nullLogModule: ContainerModule;
export declare const logModule: ContainerModule;
