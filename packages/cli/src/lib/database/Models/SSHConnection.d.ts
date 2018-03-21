import { JsonSchema } from 'objection';
import { AbstractInteractiveModel } from './AbstractInteractiveModel';
import { InteractionSchema } from '../model-interaction';
export declare class SSHConnection extends AbstractInteractiveModel {
    readonly id: number;
    name: string;
    user: string;
    host: string;
    port: number;
    method: string;
    password: string;
    localPath: string;
    hostPath: string;
    static tableName: string;
    static readonly jsonSchema: JsonSchema;
    static readonly interactionSchema: InteractionSchema;
}
export default SSHConnection;
