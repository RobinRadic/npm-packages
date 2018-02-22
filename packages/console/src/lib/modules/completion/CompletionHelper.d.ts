import { CommandConfig, HelperOptionsConfig } from '../../interfaces';
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, CliStartEvent } from '../../core/events';
import { SubCommandsGetFunction } from '../../utils/functions';
import { Dispatcher } from '../../core/Dispatcher';
import { Config } from '../../core/config';
import { Completion } from './Completion';
export declare class CompletionHelper {
    config: HelperOptionsConfig;
    events: Dispatcher;
    cliConfig: Config;
    globalOptions: string[];
    completion: Completion;
    protected readonly getSubCommands: SubCommandsGetFunction;
    onActivation(): void;
    onStart(event: CliStartEvent): void;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
    protected getGroup(config: CommandConfig): {};
    protected getCommand(config: CommandConfig): any[];
}
