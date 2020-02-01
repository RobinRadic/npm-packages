import { BaseCommand }     from '../BaseCommand';
import * as Parser         from '@oclif/parser';
import { flags }           from '@oclif/command';
import { Input }                             from '../Input';
import { modifyConfigFile, restartServices } from '../helpers';
import { out, Output }                       from '../Output';
import { readFileSync, writeFileSync } from 'fs';

export default class XdebugCommand extends BaseCommand {
    static description = 'Disable a nginx site';

    static args: Parser.args.IArg[] = [ { name: 'operation', required: true, description: 'enable | disable | edit' } ];
    static flags                    = {
        help      : flags.help({ char: 'h' }),
        noRestart : flags.string({ char: 'n', description: 'dont restart php fpm and nginx' }),
        version   : flags.string({ char: 'v', description: 'PHP Version' }),
        askVersion: flags.boolean({ char: 'V', description: 'Ask PHP Version' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(XdebugCommand);
        let version           = 'ALL';
        let sapi              = 'ALL';


        if ( flags.version ) {
            version = flags.version;
        } else if ( flags.askVersion ) {
            version = await Input.list('PHP Versions', [ 'ALL', '7.2', '7.3', '7.4' ] as any,'ALL');
        }

        if('edit'.startsWith(args.operation)){
            if(version === 'ALL'){
                let c = this.io.out.chalk
                this.io.warn('You cannot edit xdebug settings for all PHP versions. Pick a version');
                version = await Input.list('PHP Versions', [ '7.2', '7.3', '7.4' ] as any);
            }
            if(!await modifyConfigFile(this,`/etc/php/${version}/mods-available/xdebug.ini`,true)){
                return;
            }
            this.io.success('XDebug configuration was modified');
        } else if ( 'enable'.startsWith(args.operation) ) {
            this.createExec()(`sudo phpenmod -v ${version} -s ${sapi} xdebug`);
            this.io.success('XDebug enabled');
        } else if ( 'disable'.startsWith(args.operation) ) {
            this.createExec()(`sudo phpdismod -v ${version} -s ${sapi} xdebug`);
            this.io.success('XDebug disabled');
        } else {
            return this.error('invalid operation');
        }

        this.restartServices()
    }
}
