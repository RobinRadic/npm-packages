import { SiteArray }   from '../SiteArray';
import { Input }       from './Input';
import { BaseCommand } from './BaseCommand';
import { out }                 from './Output';
import { exec, ExecException } from 'child_process';

export async function filterSites(sites: SiteArray, name?: string): Promise<SiteArray> {

    if ( sites.length === 0 ) {
        return this.error('No sites available to enable');
    }

    if ( name ) {
        sites = sites.search(name);
        if ( sites.length === 0 ) {
            this.error('No sites found');
        }
        if ( sites.length > 1 ) {
            sites = await Input.checkbox('select site(s)', sites.map(site => ({
                name : site.prettyName,
                value: site,
            })));
        }
    } else {
        sites = await Input.checkbox('select site(s)', sites.map(site => ({
            name : site.prettyName,
            value: site,
        })));
    }

    return sites;
}


export function restartServices(cmd: BaseCommand) {
    function restart(this: BaseCommand) {
        const { args } = this.parse(this.constructor);
        if ( !args.noRestart ) {
            out.info('restarting services');
            this.createExec()(`sudo service php7.2-fpm restart`);
            this.createExec()(`sudo service php7.3-fpm restart`);
            this.createExec()(`sudo service nginx restart`);
            out.success('services restarted');
        }
    }

    restart.call(cmd);
}
