import { TreeCmd } from "radical-console";
export declare class RTreeCmd extends TreeCmd {
    desc: boolean;
    opts: boolean;
    all: boolean;
    handle(...args: any[]): boolean;
}
export default RTreeCmd;
