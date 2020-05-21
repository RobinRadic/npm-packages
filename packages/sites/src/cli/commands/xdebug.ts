import { BaseCommand }      from '../BaseCommand';
import * as Parser          from '@oclif/parser';
import { flags }            from '@oclif/command';
import { Input }            from '../Input';
import { modifyConfigFile } from '../helpers';

const sapis    = [ 'cli', 'fpm' ];
const versions = [ '7.2', '7.3', '7.4' ];

export default class XdebugCommand extends BaseCommand {
    static description = 'Disable a nginx site';

    static args: Parser.args.IArg[] = [ { name: 'operation', required: true, description: 'enable | disable | edit | status' } ];
    static flags                    = {
        help      : flags.help({ char: 'h' }),
        sapi      : flags.string({ char: 's', description: 'SAPI', options: sapis.concat([ 'all' ]), default: 'all' }),
        noRestart : flags.string({ char: 'n', description: 'dont restart php fpm and nginx' }),
        version   : flags.string({ char: 'v', description: 'PHP Version', options: versions.concat([ 'all' ]), default: '7.3' }),
        askVersion: flags.boolean({ char: 'V', description: 'Ask PHP Version' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(XdebugCommand);
        let version           = flags.version.toUpperCase();
        let sapi              = flags.sapi.toUpperCase();


        if ( flags.askVersion ) {
            version = await Input.list('PHP Versions', [ 'ALL'].concat(this.app.php.versionList), 'ALL');
        }

        let phpVersion = this.app.php.versions[version]

        if ( 'edit'.startsWith(args.operation) ) {
            if ( version === 'ALL' ) {
                let c = this.io.out.chalk;
                this.io.warn('You cannot edit xdebug settings for all PHP versions. Pick a version');
                version = await Input.list('PHP Versions', this.app.php.versionList as any);
            }
            phpVersion= this.app.php.versions[version]
            if(!await phpVersion.modifyModuleConfig(this,'xdebug', true)){
            // if ( !await modifyConfigFile(this, `/etc/php/${version}/mods-available/xdebug.ini`, true) ) {
                return;
            }
            this.io.success('XDebug configuration was modified');
            this.restartServices();
        } else if ( 'enable'.startsWith(args.operation) ) {
            this.app.php.enableXdebug(version,sapi);
            // this.createExec()(`sudo phpenmod -v ${version} -s ${sapi} xdebug`);
            this.io.success('XDebug enabled');
            this.restartServices();
        } else if ( 'disable'.startsWith(args.operation) ) {
            this.createExec()(`sudo phpdismod -v ${version} -s ${sapi} xdebug`);
            this.io.success('XDebug disabled');
            this.restartServices();
        } else if ( 'status'.startsWith(args.operation) ) {
            let sapi      = flags.sapi.toLowerCase();
            let _versions = version === 'ALL' ? versions : [ version ];
            let _sapis    = sapi === 'all' ? sapis : [ sapi ];
            for ( const sapi of _sapis ) {
                for ( const version of _versions ) {
                    let enabled = this.app.php.versions[version].isXdebugEnabled(sapi);
                    // let enabled = require('fs').existsSync(`/etc/php/${version}/${sapi}/xdebug.ini`);
                    this.io.line(`php ${version} xdebug ${sapi}: ${enabled ? 'enabled' : 'disabled'}`);
                }
            }
        } else {
            return this.error('invalid operation');
        }

    }
}
