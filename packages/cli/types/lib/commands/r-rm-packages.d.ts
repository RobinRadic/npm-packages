import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "radical-console";
import { RConfig } from "../core/config";
import { Cache } from "../core/cache";
export declare class AuthoCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    cache: Cache;
    maxDepth: number;
    node: boolean;
    jspm: boolean;
    bower: boolean;
    composer: boolean;
    all: boolean;
    custom: string;
    protected actions: string[];
    validate(args: CommandArguments): any;
    handle(args: CommandArguments, ...argv: any[]): Promise<any>;
}
export default AuthoCmd;
