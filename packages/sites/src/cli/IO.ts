import {BaseCommand} from './BaseCommand';
import chalk         from 'chalk'
import { Input }                             from './Input';
import { out, Output, OutputStyleFunctions } from './Output';

export class IO {
    constructor(protected cmd: BaseCommand) {}

    write   = (msg) => {

        process.stdout.write(msg);
        return this;
    };
    line    = msg => this.out.line(msg);
    success = msg => this.out.success(msg);
    info    = msg => this.out.info(msg);
    warning = msg => this.out.warn(msg);
    warn = msg => this.out.warn(msg);
    error   = msg => this.out.error(msg);

    out:OutputStyleFunctions<Output> = out
    ask:typeof Input = Input
}
