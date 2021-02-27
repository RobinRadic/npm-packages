import { IConfig }    from '@oclif/config';
import { observable } from 'mobx';
import { execSync }   from 'child_process';
import { resolve }    from 'path';

export const config: Partial<IConfig> = {
    phpPath    : '/etc/php',
    apache2Path: '/etc/apache2',
    nginxPath  : '/etc/nginx',
    linkDir    : 'sites',
};


export const conf = [
    { name: 'phpPath', type: 'text', value: '' },
];

export const options: Partial<IConfig> = observable.object({
    phpPath    : '/etc/php',
    apache2Path: '/etc/apache2',
    nginxPath  : '/etc/nginx',
    linkDir    : 'sites',
});
export const optionsType               = {};

export class ConfigStore {
    @observable phps: string[]    = [];
    @observable engines: string[] = [];
    @observable linkDir: string   = 'sites';
}

export const store = new ConfigStore;


export function whatis(path: string): string {
    try {
        return execSync('whatis ' + resolve(path), { encoding: 'utf8', stdio: 'pipe' });
    } catch ( e ) {
        return e?.toString();
    }
}
