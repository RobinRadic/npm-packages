import { BaseCommand }  from '../../BaseCommand';
import * as Parser                                        from '@oclif/parser';
import { getPHPStruct, getPHPVersions, modifyConfigFile } from '../../helpers';
import { flags }                                          from '@oclif/command';
import { inspect }      from 'util';
import { keyBy }        from 'lodash';

export default class PhpEditCommand extends BaseCommand {
    static description              = 'Edit configuration for a PHP version';
    static args: Parser.args.IArg[] = [
        { name: 'version', description: 'PHP version' },
        { name: 'sapi', description: 'PHP SAPI' },
    ];
    static flags                    = {
        help     : flags.help({ char: 'h' }),
        list     : flags.boolean({ char: 'l' }),
        noRestart: flags.string({ char: 'n', description: 'dont restart php fpm and nginx' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let struct       = keyBy(getPHPStruct(), 'version');
        let version           = args.version ? args.version : await this.io.ask.list('PHP Version', Object.keys(struct), '7.3');
        let php = struct[version];
        let sapi = args.sapi ? args.sapi : await this.io.ask.list('PHP Sapi', php.sapis, 'fpm')

        this.io.info(`/etc/php/${version}/${sapi}/php.ini`);
        if(!await modifyConfigFile(this, `/etc/php/${version}/${sapi}/php.ini`)){
            return this.io.warn('Made no changes');
        }
        this.io.success('Modified PHP Configuration')
        this.restartServices();
    }
}
