import { BaseNginxCommand } from '../BaseNginxCommand';
import { filterSites }      from '../helpers';

export default class DisableCommand extends BaseNginxCommand {
    static description = 'Disable a nginx site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let sites = await filterSites(this.sites.enabled());

        for ( const site of sites ) {
            site.enable();
            this.log(`Site [${site.prettyName}] disabled`);
        }

        this.restartServices()
    }
}
