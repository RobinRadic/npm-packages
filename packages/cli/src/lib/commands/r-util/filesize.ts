import { command, CommandArguments, CommandConfig, inject, InputHelper, Log, OutputHelper } from '@radic/console';

import { basename, resolve } from 'path';
import * as filesize from 'filesize';
import * as globule from 'globule'
import { statSync } from 'fs';


export interface ConnectAddArguments extends CommandArguments {
    name: string,
    host: string
    user: string
    method: string
}

@command(`filesize
[glob:string@a possible glob string]`
    , 'Add a connection', <CommandConfig> {
        onMissingArgument: 'help'
    })
export default class RcliFilesizeCmd {

    @inject('cli.helpers.output')
    out: OutputHelper;

    @inject('cli.helpers.input')
    ask: InputHelper;

    @inject('r.log')
    log: Log;

    async handle(args) {
        let table = this.out.table([ 'file', 'size' ]) as any
        let glob  = args.glob || process.cwd() + '/*';
        glob = resolve(glob);

        globule
            .find(glob)
            .forEach(fileName => {
                if ( fileName.toString().indexOf('showsize.js') > - 1 ) return;
                let size = statSync(fileName).size;
                table.push([ basename(fileName), filesize(size) ])
            });

        this.out.line(table.toString())

        return Promise.resolve()
    }
}