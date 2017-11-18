#!/usr/bin/env node
import "module-alias/register.js"
import "reflect-metadata";
import { cli, command, CommandArguments, inject, OutputHelper } from "radical-console";

@command('single', {
    options: [
        { key: 'a', name: 'append', description: 'append it' }
    ]
})
export default class {
    @inject('cli.helpers.output')
    out: OutputHelper;

    handle(args: CommandArguments, argv: string[]) {
        this.out.success('YES!')
    }
}

cli.helper('output')
    .start(__filename);