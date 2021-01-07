import { inspect }  from 'util';
import Command      from '@oclif/command';
import { Input }    from '@radic/console-input';
import { Out, out } from './out';
import { ask }      from './ask';
import { IConfig }  from '@oclif/config';
import { Paths }    from './Paths';
import { config }   from './config';

export interface BaseCommand {
    constructor: typeof BaseCommand
}

export abstract class BaseCommand extends Command {
    config: IConfig;
    protected skipAuth: boolean    = false;
    protected interactive: boolean = true;
    protected out: Out             = out;
    protected ask: typeof Input    = ask;
    protected paths: typeof Paths  = Paths;

    protected dump(...args) {
        this.log(inspect(args, { showHidden: true, depth: 10, colors: true }));
        return this;
    }


    protected init(): Promise<any> {
        this.config            = {
            ...this.config,
            ...config,
        };
        this.constructor.flags = this.constructor.flags || {};
        this.paths.setConfig(this.config);
        return super.init();
    }
}

