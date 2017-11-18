import { CommandArguments, InputHelper, Log, OutputHelper } from '@radic/console';
import { Database } from '../../database/Database';
export declare class DBCmd {
    out: OutputHelper;
    in: InputHelper;
    log: Log;
    db: Database;
    deps: boolean;
    handle(args: CommandArguments): Promise<void>;
}
export default DBCmd;
