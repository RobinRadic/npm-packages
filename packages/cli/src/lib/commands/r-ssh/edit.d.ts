import { CommandArguments, InputHelper, Log, OutputHelper } from '@radic/console';
import { RConfig } from '../../';
import { Database } from '../../database/Database';
export interface ConnectEditArguments extends CommandArguments {
    name?: string;
}
export declare class RcliConnectEditCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    config: RConfig;
    db: Database;
    host: string;
    port: string;
    user: string;
    method: string;
    pass: string;
    localPath: string;
    hostPath: string;
    handle(args: ConnectEditArguments, ...argv: any[]): Promise<void>;
}
export default RcliConnectEditCmd;
