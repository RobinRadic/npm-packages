#!/usr/bin/env node
import "reflect-metadata";
import { cli, CommandArguments, InlineCommand } from "../";


cli.parse({
    options  : [
        { key: 's', name: 'symlink', description: 'sym is good for link' }
    ],
    arguments: [
        { name: 'path', description: 'The path to the stuff', required: true, type: 'string' }
    ],
    action   : (args: CommandArguments) => {
        /** @this {InlineCommand} */
        console.log('hello!')
        console.dir({ args, me: this });
    }
});