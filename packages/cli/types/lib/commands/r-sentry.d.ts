import { Dispatcher, Log, OutputHelper } from "radical-console";
import { RConfig } from "../";
import { Client } from "raven";
export declare class SentryCmd {
    protected readonly sentry: Client;
    protected events: Dispatcher;
    protected out: OutputHelper;
    protected log: Log;
    protected config: RConfig;
    message: string;
    level: string;
    handle(...args: any[]): true | Promise<{}>;
}
export default SentryCmd;
