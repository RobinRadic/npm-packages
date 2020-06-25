import chalk, { Chalk } from 'chalk';

export {chalk,Chalk}
export type StyleCallback = (data: { msg: string, chalk: chalk.Chalk }) => string
export interface OutputStyles {
    [ key: string ]: StyleCallback

    info?: StyleCallback
    success?: StyleCallback
    error?: StyleCallback
    warn?: StyleCallback
    header?:StyleCallback
    section?:StyleCallback
}

export type OutputStyleFunctions<OUTPUT> = {
    [k in keyof OUTPUT]: (msg?:string) => OutputStyleFunctions<OUTPUT>
}& {
    [K in keyof OutputStyles]: (msg?:string) => OutputStyleFunctions<OUTPUT>
} & {
    chalk:Chalk
}

export class Output {
    styles: OutputStyles = {}
chalk:Chalk=chalk

    write(msg, style=null) {
        if(style){
            msg=this.getStyleCaller(style)(msg)
        }
        process.stdout.write(msg);
        return this;
    };

    nl(){
        this.write('\n');
        return this;
    }

    line(msg='',style=null) {
        return this.write(msg, style).nl()
    }

    getStyle(style): StyleCallback {
        if ( !(style in this.styles) ) {
            throw new Error(`Style [${style}] does not exist`);
        }
        return this.styles[ style ];
    }

    getStyleCaller(styleName: keyof OutputStyles, mode:'return'|'write'|'line'='return') {
        return msg => {
            msg=this.getStyle(styleName)({ msg, chalk });
            if(mode === 'return'){
                return msg;
            }
            this[mode](msg);
            return this;
        };
    }

    style(styleName, msg) {
        let style = this.getStyle(styleName);
        return style({ msg, chalk });
    }

    setStyle(name: string, callback: StyleCallback) {
        this.styles[ name ] = callback;
        return this;
    }
}

const output = new Output()
output.setStyle('info', ({chalk,msg}) => chalk.blue(msg))
output.setStyle('success', ({chalk,msg}) => chalk.green(msg))
output.setStyle('warn', ({chalk,msg}) => chalk.bold.yellow(msg))
output.setStyle('error', ({chalk,msg}) => chalk.bgRed.white(msg))
output.setStyle('header', ({chalk,msg}) => chalk.bold(msg) + "\n" + '-'.repeat(msg.length))
output.setStyle('section', ({chalk,msg}) => chalk.bold(msg))

export const out:OutputStyleFunctions<Output> = new Proxy<OutputStyleFunctions< Output>>(output as any, {
    get(target: any|Output, p: string | number | symbol, receiver: any): any {
        if ( Reflect.has(target, p) ) {
            return Reflect.get(target, p, receiver);
        }

        if ( Reflect.has(target.styles, p) ) {
            return (msg) => {
                target.getStyleCaller(p.toString(), 'line')(msg)
                return out;
            }
        }
    },
});
