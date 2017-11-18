import { CommandArguments, Dispatcher, Log, OutputHelper } from "radical-console";
import { RConfig } from "../";
import { Services } from "../services/Services";
import { ConnectHelper } from "../helpers/helper.connect";
export declare class TestCmd {
    protected events: Dispatcher;
    protected log: Log;
    protected config: RConfig;
    protected services: Services;
    protected connect: ConnectHelper;
    protected out: OutputHelper;
    handle(args: CommandArguments, ...argv: any[]): Promise<{}[]>;
}
export default TestCmd;
