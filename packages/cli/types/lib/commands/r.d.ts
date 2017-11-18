import { Dispatcher, Log } from "radical-console";
import { RConfig } from "../";
export declare class RcliCmd {
    protected events: Dispatcher;
    protected log: Log;
    protected config: RConfig;
    always(): void;
    handle(...args: any[]): boolean;
}
export default RcliCmd;
