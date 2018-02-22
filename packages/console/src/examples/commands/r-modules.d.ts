import { CommandConfig, Config, Log, OptionConfig, OutputHelper } from '../../';
export declare class ModulesCmd {
    _config: CommandConfig;
    _options: OptionConfig[];
    showHelp: () => void;
    log: Log;
    config: Config;
    out: OutputHelper;
    handle(): Promise<{}>;
}
export default ModulesCmd;
