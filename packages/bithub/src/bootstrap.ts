import { Application } from './classes/Application';
import { Bitbucket } from './classes/Bitbucket';
import { Github } from './classes/Github';
import { BitbucketDriver, Bithub, GithubDriver } from './bithub';
import { Options as GithubOptions, UsersGetAuthenticatedResponse } from '@octokit/rest';
import { Options as BitbucketOptions, Schema } from 'bitbucket';
import { Dot } from './utils';
import { Packagist } from './classes/Packagist';
import { caching, StoreConfig } from 'cache-manager';
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

export function bootstrap(options?: IConfig) {
    const app = Application.instance;
    // const bitbucket = new Bitbucket()
    // const github = new Github()

    // app.instance('config',config)

    app.binding('config',app=> {
        const config = Dot.proxied(defaultConfig);
        config.merge(options);
        return config;
    });

    app.binding('cache', app => {
        const config = app.get<Config>('config');
        const cache = caching(<CacheConfig>{
            store  : cacheFsStore,
            ttl    : 60 * 60,
            max    : 1000 * 1000,
            maxsize: 1000 * 1000,
            ...config.getClone('cache')
        } as any);

        return cache;
    });

    app.instance('packagist.constructor', Packagist);
    app.bind<Packagist>('packagist').toFactory<Packagist>(ctx => {
        const config = ctx.container.get<Config>('config');
        const Cls    = ctx.container.get<typeof Packagist>('packagist.constructor');
        return new Cls({
            throwErrors: false,
            username   : config.packagist.username,
            token      : config.packagist.token,
            url        : config.packagist.url,
        }) as any;
    });

    app.instance('bitbucket.constructor', Bitbucket);
    app.bind('bitbucket').toFactory<Bitbucket>(ctx => {
        const config = ctx.container.get<Config>('config');
        const Cls    = ctx.container.get<typeof Bitbucket>('bitbucket.constructor');
        const bb     = new Cls({
            hideNotice: true,
        });
        bb.authenticate({
            type    : 'basic',
            username: config.bitbucket.username,
            password: config.bitbucket.password,
        });
        return bb as any;
    });

    app.instance('github.constructor', Github);
    app.bind('github').toFactory<Github>(ctx => {
        const config = ctx.container.get<Config>('config');
        const Cls    = ctx.container.get<typeof Github>('github.constructor');
        const gh     = new Cls({
            auth: 'token ' + config.github.token,
        });
        return gh as any;
    });

    app.bind('bithub').to(Bithub).inSingletonScope();

    return app;
}


export class Bootstrapper {
    constructor(protected app: Application) {}

    public registerBitbucket() {}

    public registerPackagist() {}
}
