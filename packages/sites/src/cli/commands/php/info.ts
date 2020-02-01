import { BaseCommand }      from '../../BaseCommand';
import * as Parser                        from '@oclif/parser';
import { getPHPStruct, modifyConfigFile } from '../../helpers';
import { flags }                          from '@oclif/command';
import { Input }            from '../../Input';
import { inspect }          from 'util';

export default class PhpInfoCommand extends BaseCommand {
    static description              = 'Show info for a PHP version';
    static args: Parser.args.IArg[] = [
        { name: 'version', description: 'PHP version' },
    ];
    static flags                    = {
        help     : flags.help({ char: 'h' }),
        noRestart: flags.string({ char: 'n', description: 'dont restart php fpm and nginx' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);
        // let version           = args.version ? args.version : await Input.list('PHP Version', [ '7.2', '7.3', '7.4' ]);
        let struct=getPHPStruct();
        let rows = [];
        this.ux.table(struct, [{
            header: 'version',
        }] as any, {

        })
        this.io.out.success('saf')
        // console.dir(struct)
        // this.io.out.line(inspect(getPHPStruct()))
        // await modifyConfigFile(this, `/etc/php/${version}/php.ini`);
        // this.restartServices();
    }
}
