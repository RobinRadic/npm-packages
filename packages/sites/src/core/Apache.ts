import { Services }                      from '../Services';
import { basename, isAbsolute, resolve } from 'path';
import glob                              from 'glob';
import { Application }                   from './Application';
import apacheconf, { Config }            from 'apacheconf';

export { Config };

const confBaseName = (path) => basename(path, '.conf')

export class Apache {
    constructor(public readonly app: Application) {
        return;
    }

    get enabled() {return this.app.config.apache.enabled;}

    get serviceName() {return this.app.config.apache.serviceName;}

    async restart() {return Services.restart(this.serviceName); }

    path(...parts) { return resolve(this.app.config.apache.configPath, ...parts);}

    getSiteConfigPaths(kind: 'available' | 'enabled' = 'available') {return glob.sync(this.path(`sites-${kind}/*.conf`));}

    getModsConfigPaths(kind: 'available' | 'enabled' = 'available') {return glob.sync(this.path(`mods-${kind}/*.conf`));}

    getConfConfigPaths(kind: 'available' | 'enabled' = 'available') {return glob.sync(this.path(`conf-${kind}/*.conf`));}

    getSites(kind: 'available' | 'enabled' = 'available'){return this.getSiteConfigPaths(kind).map(confBaseName)}
    getMods(kind: 'available' | 'enabled' = 'available'){return this.getModsConfigPaths(kind).map(confBaseName)}
    getConfs(kind: 'available' | 'enabled' = 'available'){return this.getConfConfigPaths(kind).map(confBaseName)}

    async parseConfigFile(file: string): Promise<Config> {
        const filePath = isAbsolute(file) ? file : this.path(file);
        return new Promise((resolve, reject) => {
            apacheconf(filePath, {}, (error, config) => {
                if ( error ) return reject(error);
                resolve(config);
            });
        });
    }

    async getApacheConf(confFile: string = 'apache2.conf'): Promise<Config> {
        return await this.parseConfigFile(confFile);
    }

    getEnabledPhpModConfigFileName(): string | null {
        return this.app.apache
            .getModsConfigPaths('enabled')
            .map(p => basename(p))
            .find(key => key.startsWith('php'));
    }

    hasPhpEnabled() {
        return typeof this.getEnabledPhpModConfigFileName() === 'string';
    }

    getPhpVersion() {
        if(!this.hasPhpEnabled()){
            return null;
        }
        return this.getEnabledPhpModConfigFileName()
            .replace('php', '')
            .replace('.conf', '');
    }
}
