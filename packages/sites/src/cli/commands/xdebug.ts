import {BaseCommand} from '../BaseCommand';
import * as Parser from '@oclif/parser';
import { flags } from '@oclif/command';

export default class XdebugCommand extends BaseCommand {
    static description = 'Disable a nginx site';

    static args:Parser.args.IArg[] = [ { name: 'operation', required:true, description: 'enable | disable' } ];
    static flags = {
        help : flags.help({ char: 'h' }),
        noRestart : flags.string({ char: 'n', description: 'dont restart php fpm and nginx' })
    };

    async run() {
        await this.setup();
        const {args,flags} = this.parse(XdebugCommand)

        if('enable'.startsWith(args.operation)){
            this.createExec()(`sudo phpenmod xdebug`)
            this.io.success('XDebug enabled')
        } else if('disable'.startsWith(args.operation)){
            this.createExec()(`sudo phpdismod xdebug`)
            this.io.success('XDebug disabled')
        } else {
            return this.error('invalid operation')
        }
        this.log('restarting services')
        this.createExec()(`sudo service php7.3-fpm restart`)
        this.createExec()(`sudo service nginx restart`)
        this.log('services restarted')
    }
}
