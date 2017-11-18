import { CommandArguments } from "@radic/console";
import { RcliSshConnect } from "./connect";
export declare class RcliSshMountCmd extends RcliSshConnect {
    handle(args: CommandArguments): Promise<boolean>;
}
export default RcliSshMountCmd;
