import { CommandArguments, Dispatcher, InputHelper, Log, OutputHelper } from "@radic/console";
import { RConfig } from "../../core/config";
import { Database } from '../../database/Database';
export interface ConnectAddArguments extends CommandArguments {
    name: string;
    host: string;
    user: string;
    method: string;
}
export declare class RcliConnectAddCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    config: RConfig;
    events: Dispatcher;
    db: Database;
    pass: boolean;
    key: boolean;
    port: number;
    localPath: string;
    hostPath: string;
    force: boolean;
    interactive: boolean;
    editor: boolean;
    help: boolean;
    handle(args: ConnectAddArguments, ...argv: any[]): Promise<void>;
}
export default RcliConnectAddCmd;
