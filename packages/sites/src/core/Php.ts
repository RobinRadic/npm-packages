import { IConfigPhp, IPhpSapi, IPhpVersion } from '../interfaces';
import { PhpVersion }                        from './PhpVersion';

export class Php {
    isPhpSapi    = (val): val is IPhpSapi => [ 'cli', 'fpm', 'apache2' ].includes(val);
    isPhpVersion = (val): val is IPhpVersion => this.config.versions.filter(v => v.version === val).length === 1;

    public versions: Record<IPhpVersion, PhpVersion> = {};

    public get versionList(): string[] {return Object.keys(this.versions);}

    constructor(public readonly config: IConfigPhp) {
        for ( const version of config.versions ) {
            this.versions[ version.version ] = new PhpVersion(this, version);
        }
    }

    async enableXdebug(version: IPhpVersion | IPhpVersion[], sapi: IPhpSapi = 'all') {
        let versions = Array.isArray(version) ? version : [ version ];
        for ( const version of versions ) {
            await this.versions[ version ].enableXdebug(sapi);
        }
    }

    async disableXdebug(version: IPhpVersion | IPhpVersion[], sapi: IPhpSapi = 'all') {
        let versions = Array.isArray(version) ? version : [ version ];
        for ( const version of versions ) {
            await this.versions[ version ].disableXdebug(sapi);
        }
    }

}
