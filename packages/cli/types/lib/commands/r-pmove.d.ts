import { CommandArguments, Dispatcher } from "radical-console";
import { BaseCommand } from "../";
export declare class PMoveCmd extends BaseCommand {
    protected events: Dispatcher;
    handle(args: CommandArguments, argv?: string[]): Promise<boolean>;
}
export default PMoveCmd;
