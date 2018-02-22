import { TreeCmd, command, option, CommandArguments, CommandConfig, Config, inject, Log, OptionConfig } from "../../";

@command('tree', 'Show command structure')
export class Tree extends TreeCmd {

    @option('d', 'show descriptions')
    desc: boolean;

    @option('o', 'show options')
    opts: boolean;

    @option('a', 'show all')
    all: boolean;

    @option('A', 'show aliases')
    aliases: boolean

    handle() {
        this.printTree('r', this.cli.rootCommand);
    }
}

export default Tree