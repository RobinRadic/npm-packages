import 'reflect-metadata';
import 'tty';
import { SiteArray }   from '../SiteArray';
import { BaseCommand } from './BaseCommand';
import { Input }       from './Input';
import * as Parser     from '@oclif/parser';
import { flags } from '@oclif/command';


export abstract class BaseNginxCommand extends BaseCommand {


    static args: Parser.args.IArg[] = [ { name: 'name', description: 'name or part of name' } ];
    static flags                    = {
        help     : flags.help({ char: 'h' }),
        noRestart: flags.string({ char: 'n', description: 'dont restart php fpm and nginx' }),
    };
    // async filterSites(sites: SiteArray, name?: string) {
    //
    //     if ( sites.length === 0 ) {
    //         return this.error('No sites available to enable');
    //     }
    //
    //     if ( name ) {
    //         sites = sites.search(name);
    //         if ( sites.length === 0 ) {
    //             this.error('No sites found');
    //         }
    //         if ( sites.length > 1 ) {
    //             sites = await Input.checkbox('select site(s)', sites.map(site => ({
    //                 name : site.prettyName,
    //                 value: site,
    //             })));
    //         }
    //     } else {
    //         sites = await Input.checkbox('select site(s)', sites.map(site => ({
    //             name : site.prettyName,
    //             value: site,
    //         })));
    //     }
    //
    //     return sites;
    // }
}
