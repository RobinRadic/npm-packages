import { Application } from './classes/Application';
import { Dot } from './utils';
import { caching } from 'cache-manager';
import cacheFsStore from 'cache-manager-fs';
import { CacheConfig, Config, IConfig } from './interfaces';

const defaultConfig: Partial<IConfig> = {
    cache: {
        store  : cacheFsStore,
        ttl    : 60 * 60,
        max    : 1000 * 1000,
        maxsize: 1000 * 1000,

    },
};

export async function bootstrap(options?: IConfig) {
    const app = Application.instance;
    // const bitbucket = new Bitbucket()
    // const github = new Github()

    // app.instance('config',config)

    app.binding('config', app => {
        const config = Dot.proxied(defaultConfig);
        config.merge(options);
        return config;
    });

    app.binding('cache', app => {
        const config = app.get<Config>('config');
        const cache  = caching(<CacheConfig>{
            store  : cacheFsStore,
            ttl    : 60 * 60,
            max    : 1000 * 1000,
            maxsize: 1000 * 1000,
            ...config.getClone('cache'),
        } as any);

        return cache;
    });

    return app;
}
