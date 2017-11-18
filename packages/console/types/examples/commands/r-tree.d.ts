import { TreeCmd } from "@radic/console";
export declare class Tree extends TreeCmd {
    desc: boolean;
    opts: boolean;
    all: boolean;
    aliases: boolean;
    handle(): void;
}
export default Tree;
