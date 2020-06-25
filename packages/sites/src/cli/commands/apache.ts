import { BaseCommand } from '../BaseCommand';
import * as Parser     from '@oclif/parser';
import { flags }       from '@oclif/command';
import { basename }    from 'path';
import { green, red }  from 'chalk';

let lc = [
    'boot',
    'start',
    'parse',
    'run',
];

export interface Flags {

}

export interface Args {
    type?: 'modules' | 'configs' | 'sites'
    action?: 'list' | 'enable' | 'disable'
}

const types   = [ 'modules', 'configs', 'sites' ];
const actions = [ 'list', 'enable', 'disable' ];

export default class TestCommand extends BaseCommand {
    static description = 'Test command for dev';

    //For variable length arguments, disable argument validation with static strict = false on the command.
    static strict: boolean               = false;
    static args: Parser.args.IArg<any>[] = [
        { name: 'type', description: 'Type', options: types, parse: input => input.split(' ') },
        { name: 'action', description: 'Action', options: actions, default: 'list', parse: input => input.split(' ') },
    ];

    static flags = {
        help: flags.help({ char: 'h' }),
    };

    async run() {
        await this.setup();
        const { args, flags } = this.parse<Flags, Args>(this.constructor);
        const { apache }      = this.app;

        const data = {
            modules: { available: apache.getMods('available'), enabled: apache.getMods('enabled') },
            configs: { available: apache.getConfs('available'), enabled: apache.getConfs('enabled') },
            sites  : { available: apache.getSites('available'), enabled: apache.getSites('enabled') },
        };

        args.type  = args.type ?? await this.io.ask.list('Type', types);
        const type = data[ args.type ];
        if ( args.action === 'list' ) {
            for ( const name of type.available ) {
                if ( type.enabled.includes(name) ) {
                    this.io.line(' - ' + green(name));
                } else {
                    this.io.line(' - ' + red(name));
                }
            }
        } else {
            if ( args.action === 'enable' ) {
                this.io.info('Enable')
            } else if ( args.action === 'disable' ) {
                this.io.info('Disable')
            } else {
                this.io.error('No action selected');
            }
        }
    }


    async run2() {

        let config           = await this.app.apache.getApacheConf();
        let modConfigs: any  = {};
        let siteConfigs: any = {};
        for ( const modConfigPath of this.app.apache.getModsConfigPaths('enabled') ) {
            modConfigs[ basename(modConfigPath) ] = await this.app.apache.parseConfigFile(modConfigPath);
        }
        for ( const siteConfigPath of this.app.apache.getSiteConfigPaths('enabled') ) {
            siteConfigs[ basename(siteConfigPath) ] = await this.app.apache.parseConfigFile(siteConfigPath);
        }
        let phpEnabled    = this.app.apache.hasPhpEnabled();
        let phpModVersion = null;
        if ( phpEnabled ) {
            phpModVersion = this.app.apache.getPhpVersion();
        }

    }
}
