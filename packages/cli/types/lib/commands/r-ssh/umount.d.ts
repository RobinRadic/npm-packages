import { CommandArguments } from "radical-console";
import { RcliSshConnect } from "./connect";
export declare class RcliSshUMountCmd extends RcliSshConnect {
    handle(args: CommandArguments): Promise<boolean>;
}
export default RcliSshUMountCmd;
