import { inspect } from 'util';
import Command     from '@oclif/command';
import { Output }  from '@radic/console-output';
import { Input }   from '@radic/console-input';
import { out }     from './out';
import { ask }     from './ask';


export interface BaseCommand {
    constructor: typeof BaseCommand
}

export abstract class BaseCommand extends Command {
    protected skipAuth: boolean    = false;
    protected interactive: boolean = true;
    protected out: Output          = out;
    protected ask: typeof Input    = ask;

    protected dump(...args) {
        this.log(inspect(args, { showHidden: true, depth: 10, colors: true }));
        return this;
    }


    protected init(): Promise<any> {
        this.constructor.flags = this.constructor.flags || {};
        return super.init();
    }
}
