/// <reference types="winston" />
import { VerboseHelperOptionsConfig } from '../../interfaces';
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, HelpersStartedEvent } from '../../core';
import { LoggerInstance } from 'winston';
export declare class VerbosityHelper {
    config: VerboseHelperOptionsConfig;
    log: LoggerInstance;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
    onHelpersStarted(event: HelpersStartedEvent): void;
}
