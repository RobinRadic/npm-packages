import { CommandArguments, Dispatcher, InputHelper, LoggerInstance, OutputHelper } from "radical-console";
import { RConfig } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
export declare class GitRepoCmd {
    showHelp: () => void;
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    config: RConfig;
    events: Dispatcher;
    gitRemote: boolean;
    gitRemoteName: string;
    gitRemoteHttp: boolean;
    options: any;
    handle(args: CommandArguments, ...argv: any[]): Promise<any>;
}
export default GitRepoCmd;
