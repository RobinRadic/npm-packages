import { Cli, CommandArguments, InputHelper, Log, OutputHelper } from "@radic/console";
export declare class Servecmd {
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    cli: Cli;
    handle(args: CommandArguments): void;
    protected handleForked(args: CommandArguments): void;
}
export default Servecmd;
