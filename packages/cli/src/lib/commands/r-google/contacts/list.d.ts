import { CommandArguments, Log, OutputHelper } from "@radic/console";
import { Services } from "../../../services/Services";
import { GoogleServiceContacts } from "../../../services/service.google";
import { ConnectHelper } from "../../../helpers/helper.connect";
export declare class GoogleContactsListCmd {
    services: Services;
    out: OutputHelper;
    connect: ConnectHelper;
    log: Log;
    search: string;
    handle(args: CommandArguments): Promise<GoogleServiceContacts>;
}
export default GoogleContactsListCmd;
