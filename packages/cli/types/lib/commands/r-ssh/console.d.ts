import { CommandArguments } from "radical-console";
import { RcliSshConnect } from "./connect";
export declare class RcliSshConsoleCmd extends RcliSshConnect {
    handle(args: CommandArguments): Promise<boolean>;
}
export default RcliSshConsoleCmd;
