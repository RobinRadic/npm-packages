import {BaseCommand} from '../BaseCommand';

export default class ListCommand extends BaseCommand {
    static description = 'List sites';

    async run() {
        await this.setup();
        this.ux.styledHeader('Disabled');
        this.sites.disabled().forEach(site => this.ux.info('- ' + site.prettyName));
        this.ux.info('');
        this.ux.styledHeader('Enabled');
        this.sites.enabled().forEach(site => this.ux.info('- ' + site.prettyName));
    }
}
