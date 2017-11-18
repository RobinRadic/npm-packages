import { CommandArguments, InputHelper, LoggerInstance, OutputHelper } from "radical-console";
import { SshBashHelper, RConfig } from "../../";
export declare class RcliConnectRemoveCmd {
    log: LoggerInstance;
    out: OutputHelper;
    ask: InputHelper;
    config: RConfig;
    ssh: SshBashHelper;
    handle(args: CommandArguments, ...argv: any[]): Promise<any>;
}
export default RcliConnectRemoveCmd;
