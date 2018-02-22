#!/usr/bin/env node
import "reflect-metadata";
import { cli, command, CommandArguments, inject, OutputHelper } from "..";

@command('single', {
    options: [
        { key: 'a', name: 'append', description: 'append it' }
    ]
})
export default class {
    @inject('cli.helpers.output')
    out: OutputHelper;

    handle(args: CommandArguments, argv: string[]) {
        this.out.line('YES!')
    }
}

cli.helper('output')
    .start(__filename);