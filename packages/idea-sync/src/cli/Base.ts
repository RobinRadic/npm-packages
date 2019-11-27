import 'reflect-metadata';

import { Command } from '@oclif/command';
import { cli } from 'cli-ux';
import { execSync } from 'child_process';
import { inspect } from 'util';
import 'tty';
import { decorate, injectable } from 'inversify';

decorate(injectable(), Command);

export default interface Base {
    constructor: typeof Base
}

@injectable()
export default abstract class Base extends Command {
    public readonly prompt: typeof cli.prompt = cli.prompt;
    protected skipAuth: boolean               = false;
    protected interactive: boolean            = true;

    protected dump(...args) {
        this.log(inspect(args, { showHidden: true, depth: 10, colors: true }));
        return this;
    }


    protected init(): Promise<any> {
        this.constructor.flags = this.constructor.flags || {};
        // this.constructor.flags.username = username()
        return super.init();
    }

    protected didSetup = false;

    async setup(): Promise<any> {

    }

    createExec(cwd) {
        return (command, log = true) => {
            if ( log ) {
                this.log(command);
            }
            execSync(command, { encoding: 'utf8', cwd });
        };
    }
}
