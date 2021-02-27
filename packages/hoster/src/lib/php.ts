import { glob }           from 'glob';
import { resolve }        from 'path';
import { execSync }       from 'child_process';
import semver, { SemVer } from 'semver';
import { whatis }         from './config';

export function findPhpBinaries(locations: string | string[] = [ '/usr/bin', '/usr/sbin', '/usr/local/bin', '/bin' ]) {
    locations   = Array.isArray(locations) ? locations : [ locations ];
    const paths = [];
    for ( let location of locations ) {
        let pattern = /^php$|^php(?:\d\.\d)|^php-fpm(?:\d\.\d)/gm;
        let found   = glob.sync('php**', { cwd: resolve(location) });

        found.map(path => resolve(location, path))
            .filter(path => {
                let explenation = whatis(path);
                return explenation.includes('PHP Command Line Interface') || explenation.includes('PHP FastCGI Process Manager');
            })
            .forEach(path => paths.push(path));
    }
    return paths;
}

export interface PhpBinaryData {
    name: string
    path: string
    date: Date
    version: string
    semver: SemVer
    ts: boolean
    nts: boolean
    type: 'cli' | 'fpm-fcgi' | string
    hasXdebug: boolean
    hasOpcache: boolean
    xdebugVersion: string
    opcacheVersion: string
}


export function getPhpBinaryData(path): PhpBinaryData {
    let getPhpExpression     = () => /PHP ([\d\.\-\+\w]*) \((.*?)\) \(built: (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):(\d{2})\) \(\s(\w+?)\s\)/gm;
    let getXdebugExpression  = () => /with Xdebug\sv([\d\.\-\+\w]*)/gm;
    let getOpcacheExpression = () => /with Zend OPcache\sv([\d\.\-\+\w]*)/gm;
    let versionString        = execSync(path + ' -v', { encoding: 'utf8' });
    let matches: any         = {};
    let matchNames: string[] = [ 'name', 'version', 'type', 'month', 'day', 'year', 'hour', 'minute', 'second', 'safe' ];
    getPhpExpression().exec(versionString).forEach((value, index) => matches[ matchNames[ index ] ] = value);
    let date  = new Date(matches.year, matches.month, matches.day, matches.hour, matches.minute, matches.second);
    let date2 = new Date(Date.parse([ 'month', 'day', 'year', 'hour', 'minute', 'second' ].map(name => matches[ name ]).join(' ')));

    if ( matches.version.includes('+') ) {
        let indexof     = matches.version.indexOf('+');
        matches.version = matches.version.substr(0, indexof);
    }

    let result: PhpBinaryData = {
        name          : matches.name,
        version       : matches.version,
        semver        : semver.parse(matches.version),
        date,
        path,
        ts            : matches.safe === 'TS',
        nts           : matches.safe === 'NTS',
        type          : matches.type,
        xdebugVersion : null,
        opcacheVersion: null,
        hasXdebug     : getXdebugExpression().test(versionString),
        hasOpcache    : getOpcacheExpression().test(versionString),
    };
    if ( result.hasXdebug ) {
        result.xdebugVersion = getXdebugExpression().exec(versionString)[ 1 ];
    }
    if ( result.hasOpcache ) {
        result.opcacheVersion = getXdebugExpression().exec(versionString)[ 1 ];
    }
    return result;
}

export const isPhpBinaryData = (value: any): value is PhpBinaryData => value && value.path && value.path.startsWith('/');

export function getPhpConfigurationData(binaryData: PhpBinaryData)
export function getPhpConfigurationData(path: string)
export function getPhpConfigurationData(path: any) {
    path               = isPhpBinaryData(path) ? path.path : path;
    let output         = execSync(`${path} --ini`, { encoding: 'utf8', stdio: 'pipe' });
    let lines          = output.split('\n');
    let configFilePath = lines
        .filter(line => line.startsWith('Loaded Configuration File:'))
        .map(path => path.substr(path.indexOf('/')).replace(',', ''));

    let extensionFilePaths = lines
        .map(path => path.substr(path.indexOf('/')).replace(',', ''))
        .filter(path => path.endsWith('.ini'))
        .slice(1);

// .map(path => ({ path, config: ini.parse(readFileSync(path, 'utf8')) }))

    return;
}
