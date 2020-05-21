import { IConfig, IConfigPhpVersion } from './interfaces';

const phpVersion                    = (version: string, config: Partial<IConfigPhpVersion> = {}): Partial<IConfigPhpVersion> => ({
    version,
    configPath : `/etc/php/${version}`,
    binPath    : `/usr/bin/php${version}`,
    serviceName: `php${version}-fpm`,
    enabled    : true
});
export const defaultConfig: IConfig = {
    php     : {
        configPath: '/etc/php',
        versions  : [
            phpVersion('7.2'),
            phpVersion('7.3'),
            phpVersion('7.4'),
        ],
    },
    hostfile: {
        path: '/etc/hosts',
    },
    nginx   : {
        configPath : '/etc/nginx',
        serviceName: 'nginx',
    },
    apache  : {
        configPath : '/etc/apache2',
        serviceName: 'apache2',
    },
};
export default defaultConfig;
