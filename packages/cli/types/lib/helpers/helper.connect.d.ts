import { HelperOptionsConfig, InputHelper } from 'radical-console';
import { Services } from '../services/Services';
import { Credential } from '../database/Models/Credential';
import { IService } from '../interfaces';
import { Database } from '../database/Database';
export declare class ConnectHelper {
    config: HelperOptionsConfig;
    services: Services;
    ask: InputHelper;
    db: Database;
    getCredentialForService(service: string | string[], connectionArg?: string): Promise<Credential>;
    getService<T extends IService>(service: string | string[], connectionArg?: string): Promise<T>;
}
