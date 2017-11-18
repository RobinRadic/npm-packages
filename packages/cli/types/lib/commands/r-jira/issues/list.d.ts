import { CommandArguments } from "radical-console";
import { BaseServiceCommand } from "../../../core/commands";
export declare class JiraIssuesListCmd extends BaseServiceCommand {
    credential: string;
    handle(args: CommandArguments, argv: string[]): Promise<void>;
}
export default JiraIssuesListCmd;
