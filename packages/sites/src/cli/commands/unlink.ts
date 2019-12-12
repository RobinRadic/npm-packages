import {BaseCommand}                           from '../BaseCommand';
import { existsSync, rmdirSync, unlinkSync } from "fs";
import { Paths }                             from '../../Paths';

export default class UnlinkCommand extends BaseCommand {
    static description = 'Unlink Sites';

    async run() {
        await this.setup();
        if ( existsSync(Paths.cwd('sites')) && existsSync(Paths.cwd('sites/nginx')) ) {
            unlinkSync(Paths.cwd('sites/nginx'));
            unlinkSync(Paths.cwd('sites/apache2'));
            unlinkSync(Paths.cwd('sites/php73'));
            unlinkSync(Paths.cwd('sites/php72'));
            rmdirSync(Paths.cwd('sites'));
        }
        this.io.success('Sites available');

    }
}
