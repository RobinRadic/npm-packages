import { CommandArguments, Log, OutputHelper } from "radical-console";
import { RConfig } from "../../";
import { Database } from '../../database/Database';
export declare class RcliConnectListCmd {
    out: OutputHelper;
    log: Log;
    config: RConfig;
    db: Database;
    exclude: string[];
    handle(args: CommandArguments, ...argv: any[]): Promise<void>;
}
export default RcliConnectListCmd;
