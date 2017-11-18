import { CommandArguments } from "radical-console";
import { BaseCommand } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
export declare class JiraProjectsCmd extends BaseCommand {
    list: boolean;
    credential: string;
    protected connect: ConnectHelper;
    handle(args: CommandArguments, argv: string[]): Promise<boolean>;
}
export default JiraProjectsCmd;
