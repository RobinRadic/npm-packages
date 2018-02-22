import { CommandArguments, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { SshBashHelper, RConfig } from "../../";
export declare class RcliConnectRemoveCmd {
    log: LoggerInstance;
    out: OutputHelper;
    ask: InputHelper;
    config: RConfig;
    ssh: SshBashHelper;
    handle(args: CommandArguments, ...argv: any[]): Promise<LoggerInstance>;
}
export default RcliConnectRemoveCmd;
