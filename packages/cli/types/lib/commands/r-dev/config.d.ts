import { CommandArguments, Config, InputHelper, Log, OutputHelper } from "@radic/console";
import { IConfig } from "@radic/util";
import { PersistentFileConfig } from "../../";
export declare class ConfigCmd {
    showHelp: () => void;
    configRcli: PersistentFileConfig;
    configCli: Config;
    config: IConfig;
    help: OutputHelper;
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    list: boolean;
    delete: boolean;
    force: boolean;
    backup: boolean;
    plain: boolean;
    restore: boolean;
    listBackups: boolean;
    useCli: boolean;
    handle(args: CommandArguments): any;
    protected createBackup(): this;
    protected restoreBackup(id?: string): void;
    protected listBackupIds(): void;
    protected listPath(path: any): this;
    protected set(path: any, value: any): this;
    protected unset(path: string): boolean;
}
export default ConfigCmd;
