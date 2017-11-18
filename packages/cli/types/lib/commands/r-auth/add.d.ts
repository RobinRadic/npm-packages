import { CommandArguments, Dispatcher, InputHelper, Log, OutputHelper } from "@radic/console";
import { RConfig } from "../../";
import { Services } from "../../services/Services";
export declare class AuthAddCmd {
    out: OutputHelper;
    ask: InputHelper;
    services: Services;
    log: Log;
    config: RConfig;
    events: Dispatcher;
    handle(args: CommandArguments, ...argv: any[]): Promise<void>;
}
export default AuthAddCmd;
