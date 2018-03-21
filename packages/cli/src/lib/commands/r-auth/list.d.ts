/// <reference types="winston" />
import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { RConfig } from "../../";
export declare class AuthListCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    handle(args: CommandArguments, ...argv: any[]): Promise<void | LoggerInstance>;
}
export default AuthListCmd;
