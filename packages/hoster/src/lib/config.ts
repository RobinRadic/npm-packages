import { IConfig } from '@oclif/config';

declare module '@oclif/config' {
    export interface IConfig {
        phpPath?: string
        apache2Path?: string
        nginxPath?: string
        linkDir?: string
    }
}

export const config: Partial<IConfig> = {
    phpPath    : '/etc/php',
    apache2Path: '/etc/apache2',
    nginxPath  : '/etc/nginx',
    linkDir    : 'sites',
};
