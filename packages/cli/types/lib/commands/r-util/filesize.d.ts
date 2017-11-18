import { CommandArguments, InputHelper, Log, OutputHelper } from 'radical-console';
export interface ConnectAddArguments extends CommandArguments {
    name: string;
    host: string;
    user: string;
    method: string;
}
export default class RcliFilesizeCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    handle(args: any): Promise<void>;
}
