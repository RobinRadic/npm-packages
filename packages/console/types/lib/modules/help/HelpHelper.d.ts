import { CommandConfig, HelpHelperOptionsConfig, OptionConfig } from '../../interfaces';
import { SubCommandsGetFunction } from '../../utils';
import { Cli, CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParseEvent, Dispatcher } from '../../core';
import { OutputHelper } from '../output/OutputHelper';
import { CommandDescriber } from './CommandDescriber';
import { Log } from '../../modules/log';
export declare class HelpHelper {
    config: HelpHelperOptionsConfig;
    events: Dispatcher;
    cli: Cli;
    log: Log;
    out: OutputHelper;
    readonly getSubCommands: SubCommandsGetFunction;
    createDescriber(command: CommandConfig): CommandDescriber;
    showHelp(config: CommandConfig, options: OptionConfig[]): void;
    onCommandParse(event: CliExecuteCommandParseEvent): void;
    onCommandHandle(event: CliExecuteCommandHandleEvent): void;
    onInvalidArguments(event: CliExecuteCommandInvalidArgumentsEvent): void;
}
