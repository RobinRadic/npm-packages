import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { BaseCommand, RConfig } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
export declare class AuthEditCmd extends BaseCommand {
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    handle(args: CommandArguments, ...argv: any[]): Promise<any>;
}
export default AuthEditCmd;
