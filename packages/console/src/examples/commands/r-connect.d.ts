import { OutputHelper, CommandArguments, CommandConfig, Config, Log, OptionConfig } from "../../";
export declare class RcliConnectCmd {
    showHelp: () => void;
    _config: CommandConfig;
    _options: OptionConfig[];
    out: OutputHelper;
    log: Log;
    config: Config;
    handle(args: CommandArguments, argv: any[]): void;
}
export default RcliConnectCmd;
