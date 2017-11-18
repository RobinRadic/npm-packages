import { CommandArguments, InputHelper, LoggerInstance, OutputHelper } from "@radic/console";
import { Services } from "../../../services/Services";
import { ConnectHelper } from "../../../helpers/helper.connect";
export declare class GoogleContactsDeleteCmd {
    services: Services;
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: LoggerInstance;
    type: string;
    pick: boolean;
    handle(args: CommandArguments): Promise<any>;
}
export default GoogleContactsDeleteCmd;
