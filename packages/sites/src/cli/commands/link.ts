import {BaseCommand} from '../BaseCommand';
import { existsSync, mkdirSync, symlinkSync } from "fs";
import { Paths }                              from '../../Paths';

export default class LinkCommand extends BaseCommand {
    static description = 'Link sites';

    async run() {
        await this.setup();

        if ( !existsSync(Paths.cwd('sites')) ) {
            mkdirSync(Paths.cwd('sites'));
            symlinkSync('/etc/nginx', Paths.cwd('sites/nginx'));
            symlinkSync('/etc/apache2', Paths.cwd('sites/apache2'));
            symlinkSync('/etc/php/8.0', Paths.cwd('sites/php80'));
            symlinkSync('/etc/php/7.4', Paths.cwd('sites/php74'));
            symlinkSync('/etc/php/7.3', Paths.cwd('sites/php73'));
            symlinkSync('/etc/php/7.2', Paths.cwd('sites/php72'));
        }

        this.io.success('Sites linked in local directory "./sites"');
    }
}
