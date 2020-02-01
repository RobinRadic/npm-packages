import {BaseCommand}                           from '../BaseCommand';
import { existsSync, rmdirSync, unlinkSync } from "fs";
import { Paths }                             from '../../Paths';

const unlink = (path) => existsSync(path) && unlinkSync(path)

export default class UnlinkCommand extends BaseCommand {
    static description = 'Unlink Sites';

    async run() {
        await this.setup();
        if ( existsSync(Paths.cwd('sites')) && existsSync(Paths.cwd('sites/nginx')) ) {
            unlink(Paths.cwd('sites/nginx'));
            unlink(Paths.cwd('sites/apache2'));
            unlink(Paths.cwd('sites/php74'));
            unlink(Paths.cwd('sites/php73'));
            unlink(Paths.cwd('sites/php72'));
            rmdirSync(Paths.cwd('sites'));
        }
        this.io.success('Sites available');

    }
}
