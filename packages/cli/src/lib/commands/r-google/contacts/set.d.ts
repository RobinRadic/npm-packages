import { CommandArguments, InputHelper, Log, OutputHelper } from "@radic/console";
import { Services } from "../../../services/Services";
import { ConnectHelper } from "../../../helpers/helper.connect";
import { Dictionary } from "../../../interfaces";
export declare class GoogleContactsSetCmd {
    services: Services;
    out: OutputHelper;
    ask: InputHelper;
    connect: ConnectHelper;
    log: Log;
    type: string;
    pick: boolean;
    add: boolean;
    edit: boolean;
    editName: string;
    handle(args: CommandArguments): Promise<any>;
    protected getName(choices: Dictionary<string>, name?: string): Promise<string>;
}
export default GoogleContactsSetCmd;
