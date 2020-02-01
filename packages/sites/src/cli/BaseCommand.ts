import 'reflect-metadata';

import { Command }         from '@oclif/command';
import { cli }             from 'cli-ux';
import { execSync }        from 'child_process';
import { inspect }         from 'util';
import 'tty';
import { IO }              from './IO';
import { SiteArray }       from '../SiteArray';
import glob                from 'glob';
import { resolve }         from 'path';
import { Site }            from '../Site';
import { restartServices } from './helpers';
import { Services }        from '../Services';
import { out }             from './Output';

export interface BaseCommand {
    constructor: typeof BaseCommand
}

export abstract class BaseCommand extends Command {
    public readonly ux: typeof cli            = cli;
    public readonly prompt: typeof cli.prompt = cli.prompt;
    protected skipAuth: boolean               = false;
    protected interactive: boolean            = true;

    protected get sites(): SiteArray {return new SiteArray(...glob.sync(resolve('/etc/nginx/sites-available/*')).map(path => new Site(path))); }

    public io: IO;

    protected dump(...args) {
        this.log(inspect(args, { showHidden: true, depth: 10, colors: true }));
        return this;
    }


    protected init(): Promise<any> {
        this.constructor.flags = this.constructor.flags || {};
        this.io                = new IO(this);
        // this.constructor.flags.username = username()
        return super.init();
    }

    protected didSetup = false;

    async setup(): Promise<any> {

    }

    protected async restartServices(){
        if(!await Services.validateNginxConfig()){
            out.error('Invalid nginx configuration:')
            return this.error(await Services.getNginxConfigError());
        }
        out.info('Restarting services')
        await Services.restartAll();
        out.success('Restarted services')
    }

    createExec(cwd = process.cwd()) {
        return (command, log = true) => {
            if ( log ) {
                this.log(command);
            }
            return execSync(command, { encoding: 'utf8', cwd });
        };
    }
}
