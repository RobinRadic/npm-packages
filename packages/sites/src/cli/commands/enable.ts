import * as Parser          from '@oclif/parser';
import { flags }            from '@oclif/command';
import { BaseNginxCommand } from '../BaseNginxCommand';

export default class EnableCommand extends BaseNginxCommand {
    static description = 'Enable a nginx site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let sites = await this.filterSites(this.sites.disabled());

        for ( const site of sites ) {
            site.enable();
            this.log(`Site [${site.prettyName}] enabled`)
        }

        if(!args.noRestart) {
            this.log('restarting services');
            this.createExec()(`sudo service php7.3-fpm restart`);
            this.createExec()(`sudo service nginx restart`);
            this.log('services restarted');
        }
    }
}
