import { basename, extname, resolve }                     from 'path';
import { existsSync, symlinkSync, unlinkSync }            from 'fs';
import { strHas }                                         from './utils';
import { ConfItem, NginxConfFile, NginxConfFileInstance } from 'nginx-conf';

export class Site {
    public readonly name: string;
    public readonly prettyName: string;
    public readonly enabledPath: string;
    public enabled: boolean;

    constructor(public readonly path) {
        this.name        = basename(path);
        this.prettyName  = basename(path, extname(path));
        this.enabledPath = resolve('/etc/nginx/sites-enabled', this.name);
        this.enabled     = existsSync(this.enabledPath);
    }

    public enable() {
        if ( !existsSync(this.enabledPath) ) {
            symlinkSync(this.path, this.enabledPath);
        }
        this.enabled = true;
        return this;
    }

    public disable() {
        if ( existsSync(this.enabledPath) ) {
            unlinkSync(this.enabledPath);
        }
        this.enabled = false;
        return this;
    }

    is(nameSegment: string) {return strHas(nameSegment).test(this.name); }

    config: NginxConfFileInstance;

    async getConfig(): Promise<NginxConfFileInstance> {
        return new Promise((resolve, reject) => {
            if ( this.config ) {
                return resolve(this.config);
            }
            NginxConfFile.create(this.path, (err, conf) => {
                if ( err ) {
                    return reject(err);
                }
                this.config = conf;
                resolve(conf);
            });
        });
    }

    protected async getFastCgiPass() {
        const conf = await this.getConfig();
        if ( Array.isArray(conf.nginx?.server?.location) ) {
            let location: ConfItem = conf.nginx.server.location.find(
                location => 'fastcgi_pass' in location
                    && location.fastcgi_pass._value.endsWith('fpm.sock'),
            );
            return location.fastcgi_pass
        }
    }

    async getPhpVersion(): Promise<string | undefined> {
        const conf = await this.getConfig();
        if ( Array.isArray(conf.nginx?.server?.location) ) {
            let location: ConfItem = conf.nginx.server.location.find(
                location => 'fastcgi_pass' in location
                    && location.fastcgi_pass._value.endsWith('fpm.sock'),
            );
            if ( location ) {
                return location.fastcgi_pass._value.split('/').pop().replace('php', '').replace('-fpm.sock', '');
            }
        }
    }

    async setPhpVersion(version:string) {
        const currentVersion = await this.getPhpVersion();
        const fastcgi_pass = await this.getFastCgiPass()
        fastcgi_pass._value=fastcgi_pass._value.replace(currentVersion, version);

    }
}
