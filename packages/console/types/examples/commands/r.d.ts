import { CommandConfig, Config, Log, OptionConfig, OutputHelper } from '../../';
export declare class RcliCmd {
    _config: CommandConfig;
    _options: OptionConfig[];
    showHelp: () => void;
    log: Log;
    config: Config;
    out: OutputHelper;
    always(): void;
    handle(): void;
}
export default RcliCmd;
