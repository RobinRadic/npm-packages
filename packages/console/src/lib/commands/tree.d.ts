import { Cli, Config } from '../core';
import { SubCommandsGetFunction } from '../utils';
import { CommandConfig } from '../interfaces';
import { OutputHelper } from '../modules/output/OutputHelper';
export declare class TreeCmd {
    out: OutputHelper;
    cli: Cli;
    config: Config;
    desc: boolean;
    opts: boolean;
    aliases: boolean;
    all: boolean;
    colors: {
        group: string;
        groupAlias: string;
        command: string;
        commandAlias: string;
        description: string;
        argument: string;
        requiredArgument: string;
        option: string;
    };
    readonly getSubCommands: SubCommandsGetFunction;
    protected printTree(label: string, config: CommandConfig): void;
    protected getChildren(config: CommandConfig): any;
    protected getChild(config: CommandConfig): string;
}
