import { HelperOptionsConfig, InputHelper, Log, OutputHelper } from '@radic/console';
import { RConfig } from '../core/config';
/**SSH CONNNECT HELPER*/
export interface SshConnectHelperDataSet {
    name?: string;
    user?: string;
    host?: string;
    method?: string;
    password?: string;
    port?: number;
    localPath?: string;
    hostPath?: string;
}
export declare class SshBashHelper {
    connect: HelperOptionsConfig;
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    config: RConfig;
    validateObject(obj: Object): {
        keys: string[];
        total: number;
        filled: number;
    };
    keys(): string[];
    getDataSet(name?: string, user?: string, host?: string): SshConnectHelperDataSet;
    edit(connection: any): {};
    get(name: any): SshConnectHelperDataSet;
    has(name: any): boolean;
    validateImport(file: any): boolean;
    runImport(file: any): Promise<void>;
    getName(oldName: any): Promise<any>;
    simpleBackup(): Promise<void>;
    simpleRestore(): Promise<void>;
    password(msg?: string, def?: string): Promise<void>;
    confirm(msg?: string, def?: string): Promise<void>;
    question(msg: any, def?: string): Promise<void>;
    getAll(): SshConnectHelperDataSet[];
    _faker: any;
    /**
     * @type Faker.FakerStatic
     */
    protected readonly faker: any;
    runSeeder(total?: number): Promise<void>;
    pickNamesAndProperties(): Promise<void>;
    runCleaner(): Promise<void>;
    trash(name: any, permanent?: boolean): boolean;
}
