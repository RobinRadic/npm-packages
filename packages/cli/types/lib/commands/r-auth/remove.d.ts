import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "radical-console";
import { RConfig } from "../../";
export declare class AuthRemoveCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    handle(args: CommandArguments, ...argv: any[]): Promise<any>;
}
export default AuthRemoveCmd;
