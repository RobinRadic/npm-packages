import { CommandArguments, CommandConfig, HelpHelper, InputHelper, Log, OutputHelper } from "radical-console";
import { RConfig } from "../../";
import { SSHConnection } from "../../database/Models/SSHConnection";
import { Database } from '../../database/Database';
export declare abstract class RcliSshConnect {
    out: OutputHelper;
    help: HelpHelper;
    ask: InputHelper;
    log: Log;
    config: RConfig;
    db: Database;
    _config: CommandConfig;
    dirs: boolean;
    handle(args: CommandArguments): Promise<boolean>;
    mount(target: SSHConnection): void;
    umount(target: SSHConnection): void;
    ssh(target: SSHConnection): void;
}
export default RcliSshConnect;
