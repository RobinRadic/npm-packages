import {BaseCommand}        from '../BaseCommand';
import { BaseNginxCommand } from '../BaseNginxCommand';

export default class DisableCommand extends BaseNginxCommand {
    static description = 'Disable a nginx site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let sites = await this.filterSites(this.sites.enabled());

        for ( const site of sites ) {
            site.enable();
            this.log(`Site [${site.prettyName}] disabled`)
        }

        if(!args.noRestart) {
            this.log('restarting services');
            this.createExec()(`sudo service php7.3-fpm restart`);
            this.createExec()(`sudo service nginx restart`);
            this.log('services restarted');
        }
    }
}
