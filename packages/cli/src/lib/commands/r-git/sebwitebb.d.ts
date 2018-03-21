/// <reference types="winston" />
import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { ConnectHelper, Cache, RConfig } from "../../";
export declare class AuthoCmd {
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    cache: Cache;
    cleanCache: boolean;
    handle(args: CommandArguments, ...argv: any[]): Promise<void>;
}
export default AuthoCmd;
