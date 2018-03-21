/// <reference types="winston" />
import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { RConfig } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
export declare class GitPackagistCmd {
    showHelp: () => void;
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    options: any;
    handle(args: CommandArguments, ...argv: any[]): Promise<void>;
}
export default GitPackagistCmd;
