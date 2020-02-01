import { SiteArray }                                          from '../SiteArray';
import { Input }                                              from './Input';
import { BaseCommand }                                        from './BaseCommand';
import { out }                                                from './Output';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, resolve }                                  from 'path';
import { chain }                                              from 'lodash';
import { Site }                                               from '../Site';

export interface FilterSitesFn {
    (sites: SiteArray, name?: string, multiple?:true): Promise<SiteArray|Site[]>
    (sites: SiteArray, name?: string, multiple?:false): Promise<Site>
}

export const filterSites:FilterSitesFn = async (sites: SiteArray, name?: string, multiple:boolean=true) => {

    if ( sites.length === 0 ) {
        return this.error('No sites available to enable');
    }

    const optionsMapper = site => ({ name : site.prettyName,        value: site,    })
    if ( name ) {
        sites = sites.search(name);
        if ( sites.length === 0 ) {
            this.error('No sites found');
        }
        if ( sites.length > 1 ) {
            return await Input[multiple?'checkbox':'list']('select site(s)', sites.map(optionsMapper));
        }
    } else {
        return await Input[multiple?'checkbox':'list']('select site(s)', sites.map(optionsMapper));
    }

    return multiple ? [] : null;
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


export async function modifyConfigFile(cmd: BaseCommand, filePath: string, verbose = false) {

    let originalConfig = readFileSync(filePath, 'utf8');
    let modifiedConfig = await cmd.io.ask.editor(`Modify Configuration`, { default: originalConfig });
    if ( modifiedConfig === originalConfig ) {
        verbose && cmd.io.warn('Did not modify config. Config matches current version.');
        return false;
    }
    let backupFilePath = `${filePath}.backup.${Date.now()}`;
    writeFileSync(backupFilePath, originalConfig, 'utf8');
    verbose && cmd.io.info(`Backup created @ ${backupFilePath}`);
    writeFileSync(filePath, modifiedConfig, 'utf8');
    verbose && cmd.io.info(`Written changes @ ${filePath}`);
    return true;
}

export const isDirSync     = (path) => statSync(path).isDirectory();
export const isFileSync    = (path) => statSync(path).isFile();
export const isSymlinkSync = (path) => statSync(path).isSymbolicLink();

export function getPHPStruct() {
    return getPHPVersions().map(version => {
        return {
            version,
            path             : resolve('/etc/php', version),
            modsAvailablePath: resolve('/etc/php', version, 'mods-available'),
            modsAvailable: readdirSync(resolve('/etc/php',version,'mods-available')),
            sapis            : readdirSync(resolve('/etc/php', version))
                .filter(path => !path.endsWith('mods-available'))
                .map(path => basename(path)),
        };
    });
}



export function getPHPVersions() {
    return readdirSync(`/etc/php`)
        .map(path => resolve(`/etc/php`, path))
        .filter(path => isDirSync(path))
        .filter(path => /\d\.\d/.test(basename(path)))
        .map(path => basename(path));
}
