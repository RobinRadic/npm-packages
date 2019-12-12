import {BaseCommand} from '../BaseCommand';

export default class InfoCommand extends BaseCommand {
    static description = 'Show info';

    async run() {
        await this.setup();
        this.io.line(`
sites link                # Add ./sites with nginx, php and apache config
sites unlink              # Remove ./sites
sites list                # List available and enabled sites
sites php:disable xdebug  #
sites php:enable xdebug   #
sites enable pyro.local   #
sites disable pyro.local  #
        `)
    }
}
