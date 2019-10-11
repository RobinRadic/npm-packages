import chalk from 'chalk';
import { inspect } from 'util';

const c = new (chalk.constructor)({
    enabled: true,
    level  : chalk.supportsColor.level,
});


export class Log {
    static prefix             = c.dim('[webpacker]: ');
    static styles             = {
        errorName   : msg => c.red.bold(msg),
        errorMessage: msg => c.red(msg),
        warning     : msg => c.yellow(msg),
        info        : msg => c.cyan(msg),
        success     : msg => c.green.bold(msg),
        normal      : msg => c.reset(msg),
    };
    static debugging: boolean = false;

    static write(msg: string, styleName: any = null) {
        if ( styleName in this.styles ) {
            let style = this.styles[ styleName ];
            msg       = style(msg);
        }
        process.stdout.write(msg);
        return this;
    }

    static line(msg: string, styleName: any = null) {
        this.write(this.prefix);
        this.write(msg, styleName);
        this.write('\n');
        return this;
    }

    static debug(...params) {
        if ( this.debugging ) {
            params
                .map(param => inspect(param, { colors: true, showHidden: true }))
                .forEach(value => {
                    process.stdout.write(value);
                    process.stdout.write('\n');
                });
        }
        return this;
    }

    static enableDebug() {
        this.debugging = true;
        return this;
    }

    static disableDebug() {
        this.debugging = false;
        return this;
    }
}

