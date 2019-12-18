import { BaseNginxCommand } from '../BaseNginxCommand';
import { filterSites }      from '../helpers';

export default class EnableCommand extends BaseNginxCommand {
    static description = 'Enable a nginx site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let sites = await filterSites(this.sites.disabled());

        for ( const site of sites ) {
            site.enable();
            this.log(`Site [${site.prettyName}] enabled`);
        }

        this.restartServices();
    }
}
