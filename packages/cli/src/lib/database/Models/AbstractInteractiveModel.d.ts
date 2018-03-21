import { AbstractModel } from "./AbstractModel";
import { InteractionSchema, ModelInteractor } from "../model-interaction";
export declare class AbstractInteractiveModel extends AbstractModel {
    readonly id?: number;
    static interactionSchema: InteractionSchema;
    static interact(): ModelInteractor;
}
export default AbstractInteractiveModel;
