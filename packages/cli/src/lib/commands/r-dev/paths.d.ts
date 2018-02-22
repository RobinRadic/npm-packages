import { CommandArguments, Log, OutputHelper } from "@radic/console";
import { Paths } from "../../core/paths";
import { RCFile } from "../../core/config";
export interface PathsCommandArguments extends CommandArguments {
    action: 'list' | 'set' | 'revert';
    key?: string;
}
export declare class PathsCmd {
    paths: Paths;
    out: OutputHelper;
    log: Log;
    rcfile: RCFile;
    list: boolean;
    set: string[];
    unset: string;
    reset: boolean;
    handle(args: PathsCommandArguments): boolean | void;
    protected handleList(): boolean;
    protected handleSet(): void;
    protected handleReset(): boolean;
    protected handleUnset(): void;
}
export default PathsCmd;
