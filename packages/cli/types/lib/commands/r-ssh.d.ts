import { CommandConfig, Log, OptionConfig, OutputHelper } from "radical-console";
import { Paths } from "..";
export declare class RcliSshCmd {
    _config: CommandConfig;
    _options: OptionConfig[];
    out: OutputHelper;
    log: Log;
    paths: Paths;
    handle(): void;
}
export default RcliSshCmd;
