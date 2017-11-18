import { Cli, CommandArguments, Config, Dispatcher, InputHelper, Log, OutputHelper } from "@radic/console";
import { RConfig } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
import { BaseCommand } from "../../core/commands";
export declare class GitTagCmd extends BaseCommand {
    showHelp: () => void;
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: Log;
    config: RConfig;
    cli: Cli;
    cliconfig: Config;
    events: Dispatcher;
    noBump: boolean;
    noPush: boolean;
    noConfirm: boolean;
    check: boolean;
    listTypes: boolean;
    dryRun: boolean;
    bumpTypes: string[];
    handle(args: CommandArguments, ...argv: any[]): Promise<boolean>;
    protected tag(version: string, message: string): Promise<boolean>;
}
export default GitTagCmd;
