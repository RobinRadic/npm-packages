#!/usr/bin/env node
import 'reflect-metadata';
import 'module-alias/register'
import { cli, CliConfig } from 'radical-console';



cli.config(<CliConfig> {
    commands: {
        onMissingArgument: 'help'
    }
})


cli
    .helper('completion')
    .helper('input')
    .helper('output', {
        options: {
            quiet : { enabled: true },
            colors: { enabled: true }
        }
    })
    .helper('help', {
        addShowHelpCommand: true,
        showOnError       : true,
        app               : {
            title: 'Radic CLI'
        },
        option            : { enabled: true }
    })
    .helper('verbose', {
        option: { enabled: true }
    })
    .start(__dirname + '/commands/r');




