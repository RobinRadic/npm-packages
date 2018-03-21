import { CommandArguments, InputHelper, Log, OutputHelper } from "@radic/console";
export declare class InfoCmd {
    log: Log;
    out: OutputHelper;
    in: InputHelper;
    deps: boolean;
    handle(args: CommandArguments): Promise<void>;
}
export default InfoCmd;
