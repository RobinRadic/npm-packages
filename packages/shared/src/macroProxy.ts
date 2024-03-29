export type MacroCallback<T = any> = (...args: any[]) => T

export interface MacroProxy<T, CB = MacroCallback, R = any | void> {
    macro(name: string, macro: MacroCallback<R>): R;

    hasMacro(name: string): boolean;

    runMacro(name: string, ...args: any[]): R;
}

export function macroProxy<T extends object>(obj: T): MacroProxy<T> & T {
    const macros: Record<string, MacroCallback<T>> = {} as any;
    const hasMacro                                 = (name: string) => macros[ name ] !== undefined;
    const macro                                    = (name: string, macro: MacroCallback) => {
        macros[ name ] = macro;
        return this;
    };
    const runMacro                                 = function (name: string, ...args: any[]) {
        const result = macros[ name ].apply(this, args);
        return result === undefined ? this : result;
    };
    const proxy                                    = new Proxy(obj, {
        get(target: T, p: string | symbol, receiver: any): any {
            if ( Reflect.has(obj, p) ) {
                return Reflect.get(obj, p);
            }
            let n = p.toString();
            if ( n === 'macro' ) return macro.bind(obj);
            if ( n === 'runMacro' ) return runMacro.bind(obj);
            if ( n === 'hasMacro' ) return hasMacro.bind(obj);
            if ( hasMacro(n) ) {
                let macro = macros[ n ].bind(obj);

                return macro;
            }
        },
    });
    return proxy as any;
}

export namespace macro {

    export function proxy<T extends object>(obj: T): Proxy<T> & T {
        return macroProxy<T>(obj);
    }

    export type Callback<T> = MacroCallback<T>

    export interface Proxy<T, CB = MacroCallback, R = any | void> extends MacroProxy<T, CB, R> {
        macro(name: string, macro: Callback<R>): R;
    }
}
