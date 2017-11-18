import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { RConfig } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
export declare class GitInteractiveCmd {
    showHelp: () => void;
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    handle(args: CommandArguments, ...argv: any[]): Promise<void>;
}
export default GitInteractiveCmd;
