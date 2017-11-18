import { CommandArguments, Log, OutputHelper } from "radical-console";
import { BaseCommand, Cache } from "../../";
export declare class DevCacheCmd extends BaseCommand {
    cache: Cache;
    out: OutputHelper;
    log: Log;
    dump: boolean;
    dumpRaw: boolean;
    get: string;
    set: string[];
    unset: string;
    clear: boolean;
    handle(args: CommandArguments): boolean;
    protected dumpVal(val: any): boolean;
}
export default DevCacheCmd;
