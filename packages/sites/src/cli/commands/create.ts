import { BaseNginxCommand }             from '../BaseNginxCommand';
import { Input }                        from '../Input';
import { filterSites, restartServices } from '../helpers';

export default class CreateCommand extends BaseNginxCommand {
    static description = 'Create a site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let laravel = (await Input.list('Is it a laravel website', [ 'yes', 'no' ], 'no')) === 'yes';

        let sites = await filterSites(this.sites.enabled());

        for ( const site of sites ) {
            site.enable();
            this.log(`Site [${site.prettyName}] disabled`);
        }

        this.restartServices()
    }
}
