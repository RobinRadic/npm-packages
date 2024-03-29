import { join } from 'path';

import { HostingServiceProvider } from '@radic/hosting/lib/HostingServiceProvider';
import { InputServiceProvider } from '@radic/console-input/lib/InputServiceProvider';
import { macros } from '@radic/console-output';
import { OutputServiceProvider } from '@radic/console-output/lib/OutputServiceProvider';
import { LogServiceProvider } from '@radic/console-output/lib/log/LogServiceProvider';
import { HostingCliServiceProvider } from './HostingCliServiceProvider';
import { Application } from '@radic/core';
import { CoreServiceProvider } from '@radic/core/lib/CoreServiceProvider';
import { CliStartReturn } from '@radic/console';
import { ConsoleServiceProvider } from '@radic/console/lib/ConsoleServiceProvider';


export async function bootApp() {
    let commandDir = join(__dirname, 'commands');
    const app      = Application.instance;

    await app.initialize({
        dirname  : __dirname,
        providers: [
            CoreServiceProvider,
            ConsoleServiceProvider,
            InputServiceProvider,
            OutputServiceProvider,
            LogServiceProvider,
            HostingServiceProvider,

            HostingCliServiceProvider,
        ],
        config   : {
            debug: true,

            cli    : {
                commandDir,
                setup: cli => cli
                .scriptName('hosting')
                .parserConfiguration({
                    'boolean-negation': true,
                    'negation-prefix' : 'no-',
                    'dot-notation'    : false,
                })
                .help('h', 'Show Help').alias('h', 'help')
                .option('V', { type: 'boolean', alias: 'version', global: false })
                .option('v', {
                    alias : 'verbose',
                    desc  : 'Increase output verbosity up to 3 times. Eg: -v -vv -vvv',
                    count : true,
                    global: true,
                    group : app.output.parse('{bold}Global Options:{/bold}'),
                })
                .epilog(app.output.parse(epilog))
                .usage(app.output.parse('{bold}Hosting Manager:{/bold}\n {green}${/green} hosting <{yellow}command{/yellow}>')),
            },
            startFn: async <T>(app, ...params: any[]) => {
                app.events.on('Application:error', (error, exit) => {
                    throw new Error(error);
                });

                try {
                    const result = await app.cliStart();
                    return result;
                } catch (e) {
                    app.error(e, true);
                }
            },
            output : {},
            system: {
                services: []
            },
            hosting: {
                db     : {
                    main       : 'main',
                    connections: {
                        mysql: [ {
                            name    : 'main',
                            type    : 'mysql',
                            host    : '127.0.0.1',
                            username: 'root',
                            // insecureAuth: true,
                            // debug       : true,
                            // trace       : true,
                        } ],
                    },
                },

                servers: {
                    nginx : {
                        servers: [
                            {
                                paths: {
                                    configDir           : '/etc/nginx',
                                    modsAvailable       : '{configDir}/mods-available',
                                    modsEnabled         : '{configDir}/mods-enabled',
                                    sitesAvailable      : '{configDir}/sites-available',
                                    sitesEnabled        : '{configDir}/sites-enabled',
                                    configAvailable     : '{configDir}/conf-available',
                                    configEnabled       : '{configDir}/conf-enabled',
                                    configFiles         : [ '{configDir}/nginx.ini' ],
                                    configFileExtensions: [ 'ini', 'nginx', 'conf' ],
                                    modsFileExtensions  : [ 'conf', 'nginx' ],
                                    sitesFileExtensions : [ 'conf', 'nginx' ],
                                },
                            },
                        ],
                    },
                    apache: {
                        servers: [
                            {
                                paths: {
                                    configDir           : '/etc/apache2',
                                    modsAvailable       : '{configDir}/mods-available',
                                    modsEnabled         : '{configDir}/mods-enabled',
                                    sitesAvailable      : '{configDir}/sites-available',
                                    sitesEnabled        : '{configDir}/sites-enabled',
                                    configAvailable     : '{configDir}/conf-available',
                                    configEnabled       : '{configDir}/conf-enabled',
                                    configFiles         : [ '{configDir}/apache2.conf' ],
                                    configFileExtensions: [ 'conf' ],
                                    modsFileExtensions  : [ 'conf' ],
                                    sitesFileExtensions : [ 'conf' ],
                                },

                            },
                        ],
                    },
                },
            },

        },
    });

    let epilog = `{dim}Boolean options that have true as default can be negated using --no-[option]. So for example --reload becomes --no-reload{/dim}`;
    app.hooks.cli.command.builder.tap('MY', (command, cli) => {
        cli.epilog(app.output.parse(epilog));
    });
    app.hooks.cli.command.handler.tap('MY', (command, params) => {
        let verbose = 'v'.repeat(command.instance.verbose);
        if ( verbose ) {
            app.log.level = verbose + 'erbose';
        }
    });

    await app.boot();
    app.output.ui.addMacros([
        macros.beep,
        macros.highlight,
        macros.notify,
        macros.sparkly,
        macros.spinner,
        macros.tree,
    ]);
    return app;
}

export async function startCli() {
    const app = await bootApp();
    return await app.start<CliStartReturn>();
}
