import { BaseCommand } from '../BaseCommand';
import * as Parser     from '@oclif/parser';
import { flags }       from '@oclif/command';
import { Site }        from '../../Site';
import { filterSites } from '../helpers';
import { SiteArray }   from '../../SiteArray';

let lc = [
    'boot',
    'start',
    'parse',
    'run',
]

export default class InfoCommand extends BaseCommand {
    static description = 'Show info';

    //For variable length arguments, disable argument validation with static strict = false on the command.
    static strict:boolean=false
    static args: Parser.args.IArg<any>[] = [ { name: 'sites',  description: 'site names', parse: input => input.split(' ') } ];

    static flags = {
        help: flags.help({ char: 'h' }),
        all : flags.boolean({ char: 'a', description: 'show all' }),
        enabled : flags.boolean({ char: 'e', description: 'show all enabled' }),
        disabled : flags.boolean({ char: 'd', description: 'show all not enabled' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let sites:SiteArray|any = new SiteArray;
        if(flags.all) {
            sites = this.sites;
        } else if(flags.enabled || flags.disabled){
            sites = this.sites.filter(site => flags.enabled ? site.enabled : flags.disabled ? !site.enabled : true)
        } else {
            sites = await filterSites(this.sites,args.sites);
        }
        for(let site of sites){
            await this.showSiteInfo(site)
        }
    }

    async showSiteInfo(site: Site) {
        const conf = await site.getConfig();
        const php  = await site.getPhpVersion();

        let { out } = this.io;
        out.section(site.name + (site.enabled ? out.chalk.green(' enabled') : ''));
        out.line(`server_name...............: ${conf.nginx.server.server_name._value}
root......................: ${conf.nginx.server.root._value}
php version...............: ${php}
            `);
    }
}
