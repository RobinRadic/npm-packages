import {BaseCommand}   from '../../BaseCommand';
import * as Parser     from '@oclif/parser';
import { filterSites } from '../../helpers';
import { flags }       from '@oclif/command';
import { out }         from '../../Output';
import { Input }       from '../../Input';

export default class PhpVersionCommand extends BaseCommand {
    static description = 'Switch PHP version for site';
    static args: Parser.args.IArg[] = [
        { name: 'name', description: 'name or part of name' } ,
        { name: 'version', description: 'PHP version' }
        ];
    static flags                    = {
        help     : flags.help({ char: 'h' }),
        list     : flags.boolean({ char: 'l' }),
        noRestart: flags.string({ char: 'n', description: 'dont restart php fpm and nginx' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);
        if(flags.list){
            let list=[]
            for(const site of this.sites){
                list.push({
                    name:site.prettyName,
                    version: await site.getPhpVersion()
                })
            }
            return this.ux.table(list, {name: {}, version: {}}, {'no-header':true})
        }

        let sites = await filterSites(this.sites.enabled(), args.name);
        let version = args.version ? args.version : await Input.list('PHP Version',['7.2','7.3','7.4'])

        for(const site of sites){
            const config = await site.getConfig();
            config.on('flushed', _=>out.info(`Config modified for ${site.name}`))
            await site.setPhpVersion(version);
            config.flush()
        }


        setTimeout(_=> this.restartServices(), 2000);
    }
}
