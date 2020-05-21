import { BaseCommand } from '../BaseCommand';
import * as Parser     from '@oclif/parser';
import { flags }       from '@oclif/command';
import { basename }    from 'path';

let lc = [
    'boot',
    'start',
    'parse',
    'run',
];

export default class TestCommand extends BaseCommand {
    static description = 'Test command for dev';

    //For variable length arguments, disable argument validation with static strict = false on the command.
    static strict: boolean               = false;
    static args: Parser.args.IArg<any>[] = [
        // { name: 'sites', description: 'site names', parse: input => input.split(' ') },
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
        // all     : flags.boolean({ char: 'a', description: 'show all' }),
        // enabled : flags.boolean({ char: 'e', description: 'show all enabled' }),
        // disabled: flags.boolean({ char: 'd', description: 'show all not enabled' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);
        let config            = await this.app.apache.getApacheConf();
        let modConfigs: any      = {};
        let siteConfigs: any      = {};
        for ( const modConfigPath of this.app.apache.getModsConfigPaths('enabled') ) {
            modConfigs[ basename(modConfigPath) ] = await this.app.apache.parseConfigFile(modConfigPath);
        }
        for ( const siteConfigPath of this.app.apache.getSiteConfigPaths('enabled') ) {
            siteConfigs[ basename(siteConfigPath)] = await this.app.apache.parseConfigFile(siteConfigPath);
        }
        let phpEnabled = this.app.apache.hasPhpEnabled();
        let phpModVersion = null;
        if(phpEnabled){
            phpModVersion = this.app.apache.getPhpVersion()
        }

        return;
    }
}
