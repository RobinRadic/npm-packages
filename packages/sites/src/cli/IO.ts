import {BaseCommand} from './BaseCommand';
import chalk from 'chalk'

export class IO {
    constructor(protected cmd: BaseCommand) {}

    write   = (msg) => {
        process.stdout.write(msg);
        return this;
    };
    line    = msg => this.write(msg).write('\n');
    success = msg => this.line(msg);
    info    = msg => this.line(msg);
    warning = msg => this.line(msg);
    error   = msg => this.line(msg);
}
