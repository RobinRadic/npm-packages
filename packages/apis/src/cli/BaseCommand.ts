import 'reflect-metadata';

import { Command }  from '@oclif/command';
import { cli }      from 'cli-ux';
import { execSync } from 'child_process';
import { inspect }  from 'util';
import 'tty';
import { IO }       from './IO';
import { out }      from './Output';

export interface BaseCommand {
    constructor: typeof BaseCommand
}

export abstract class BaseCommand extends Command {
    public readonly ux: typeof cli            = cli;
    public readonly prompt: typeof cli.prompt = cli.prompt;
    protected skipAuth: boolean               = false;
    protected interactive: boolean            = true;


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


    createExec(cwd = process.cwd()) {
        return (command, log = true) => {
            if ( log ) {
                this.log(command);
            }
            return execSync(command, { encoding: 'utf8', cwd });
        };
    }
}
