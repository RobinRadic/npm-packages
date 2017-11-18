import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from 'radical-console';
import { Cache, ConnectHelper, RConfig } from '../../';
export declare class AuthoCmd {
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    cache: Cache;
    handle(args: CommandArguments, ...argv: any[]): Promise<void>;
}
export default AuthoCmd;
