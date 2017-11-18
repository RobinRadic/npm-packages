import { CommandArguments, InputHelper, Log, OutputHelper } from "radical-console";
export declare class InfoCmd {
    log: Log;
    out: OutputHelper;
    in: InputHelper;
    deps: boolean;
    handle(args: CommandArguments): Promise<void>;
}
export default InfoCmd;
