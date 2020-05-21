import { Chalk } from 'chalk';
export declare class Log {
    static color: Chalk;
    static prefix: string;
    static styles: {
        errorName: (msg: any) => string;
        errorMessage: (msg: any) => string;
        warning: (msg: any) => string;
        info: (msg: any) => string;
        success: (msg: any) => string;
        normal: (msg: any) => string;
    };
    static debugging: boolean;
    static write(msg: string, styleName?: any): typeof Log;
    static line(msg: string, styleName?: any): typeof Log;
    static debug(...params: any[]): typeof Log;
    static enableDebug(): typeof Log;
    static disableDebug(): typeof Log;
}
