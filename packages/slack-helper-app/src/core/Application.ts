import { App as Slack }                                        from '@slack/bolt';
import { config, DotenvConfigOptions }                         from 'dotenv';
import Conf                                                    from 'conf';
import { ApplicationOptions, Extension, ExtensionConstructor } from '../interfaces';
import { SyncHook }                                            from 'tapable';
import { debug }                                               from '../debug';

export class Application {
    public static readonly hooks = {
        starting        : new SyncHook(),
        started         : new SyncHook(),
        error           : new SyncHook<Error>(),
        initExtensions  : new SyncHook(),
        createExtension : new SyncHook<ExtensionConstructor>(),
        createdExtension: new SyncHook<Extension>(),
        initExtension   : new SyncHook<Extension>(),
        startExtension  : new SyncHook<Extension>(),
    };
    slack: Slack;
    config: Conf;


    constructor(protected options: ApplicationOptions) {
        this.config = new Conf(this.options.conf);
        this.slack  = new Slack({
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            token        : process.env.SLACK_BOT_TOKEN,
        });
        debug('constructed', options);
    }

    extensions: Extension[] = [];

    protected async initExtensions() {
        debug('initExtensions');
        Application.hooks.initExtensions.call();
        for ( const Extension of this.options.extensions ) {
            Application.hooks.createExtension.call(Extension);
            const extension = new Extension(this);
            Application.hooks.createdExtension.call(extension);
            this.extensions.push(extension);
            debug('created extension', Extension);
        }
        for ( const extension of this.extensions ) {
            if ( typeof extension[ 'init' ] === 'function' ) {
                Application.hooks.initExtension.call(extension);
                debug('initExtension', extension);
                await extension.init();
            }
        }
    }

    protected async startExtensions() {
        debug('startExtensions');
        for ( const extension of this.extensions ) {
            if ( typeof extension[ 'start' ] === 'function' ) {
                Application.hooks.startExtension.call(extension);
                debug('startExtension', extension);
                await extension.start();
            }
        }
    }

    async start() {
        await this.initExtensions();
        await this.startExtensions();
        debug('starting');
        Application.hooks.starting.call();
        this.slack.error(error => {
            Application.hooks.error.call(error);
            console.error(error);
            process.exit(1);
        });

        await this.slack.start(this.options.port);
        debug('started');
        Application.hooks.started.call();
    }

    static loadDotEnv(options?: DotenvConfigOptions) {
        config(options);
    }
}
