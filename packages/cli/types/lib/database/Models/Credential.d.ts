import { JsonSchema, Model } from 'objection';
import { Services } from '../../services/Services';
export interface CredentialsExtraField {
    [key: string]: any;
}
export declare class Credential<T extends CredentialsExtraField = CredentialsExtraField> extends Model {
    readonly id: number;
    service: string;
    name: string;
    method: string;
    key: string;
    secret: string;
    extra: T;
    default_for_service: boolean;
    protected static _services: Services;
    static readonly services: Services;
    static getDefaultFor(service: string): Promise<Credential>;
    static tableName: string;
    static readonly jsonSchema: JsonSchema;
}
export default Credential;
