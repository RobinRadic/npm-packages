import { filterSites, modifyConfigFile } from '../helpers';
import { BaseNginxCommand }              from '../BaseNginxCommand';

export default class EditCommand extends BaseNginxCommand {
    static description = 'Edit a nginx site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let site = await filterSites(this.sites, args.name, false);

        if ( !await modifyConfigFile(this, site.path) ) {
            return this.io.warn('Made no changes');
        }
        this.io.success('Modified NGinx Configuration');
        this.restartServices();
    }
}
