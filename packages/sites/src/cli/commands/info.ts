import { BaseCommand } from '../BaseCommand';
import { out }         from '../Output';
import {NginxConfFile,ConfItem} from 'nginx-conf'
export default class InfoCommand extends BaseCommand {
    static description = 'Show info';

    async run() {
        await this.setup();
        // out
        //     .info('This is info').nl()
        //     .success('This is success').nl()
        //     .warn('This is warn').nl()
        //     .error('This is error').nl()
        //     .header('This is header').nl()
        //     .section('This is section').nl()
        //     .line('This is line').nl();

        for(const site of this.sites) {
            const conf = await site.getConfig();
            const php  = await site.getPhpVersion();

            out.section(site.name + (site.enabled ? out.chalk.green(' enabled') : ''));
            out.line(`server_name...............: ${conf.nginx.server.server_name._value}
root......................: ${conf.nginx.server.root._value}
php version...............: ${php}
            `)
        }
    }
}
