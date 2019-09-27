const hasMutationObserver = window.MutationObserver || window[ 'WebKitMutationObserver' ];


export function observeDOM(obj, callback) {
    // @ts-ignore
    if ( !obj || !obj.nodeType === 1 ) return; // validation

    if ( MutationObserver ) {
        // define a new observer
        var obs = new MutationObserver(function (mutations, observer) {
            callback(mutations);
        });
        // have the observer observe foo for changes in children
        obs.observe(obj, { childList: true, subtree: true });
    } else if ( window.addEventListener ) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
    }
}


export interface WrappedClassList extends DOMTokenList {
    ensure(...tokens: string[])

    ensureNot(...tokens: string[])

    ensureIf(condition: boolean | (() => boolean), ...tokens: string[])

    ensureNotIf(condition: boolean | (() => boolean), ...tokens: string[])

    set(token: string, value: boolean)

    set(token: string[], value: boolean)

    set(classes: Record<string, boolean>)
}

export function wrapClassList(list: DOMTokenList): WrappedClassList {
    const methods     = {
        ensureIf(condition: boolean | (() => boolean), ...tokens) {
            condition = typeof condition === 'function' ? condition() : condition;
            condition && methods.ensure(...tokens);
        },
        ensureNotIf(condition: boolean | (() => boolean), ...tokens) {
            condition = typeof condition === 'function' ? condition() : condition;
            condition && methods.ensure(...tokens);
        },
        ensure(...tokens) { tokens.forEach(token => !list.contains(token) && list.add(token));},
        ensureNot(...tokens) { tokens.forEach(token => list.contains(token) && list.remove(token));},
        set(classes, value?: boolean) {
            if ( typeof classes === 'string' ) {
                return value ? methods.ensure(classes) : methods.ensureNot(classes);
            } else if ( Array.isArray(classes) ) {
                return classes.forEach(className => methods.set(className, value));
            } else if ( value === undefined ) {
                return Object.keys(classes).forEach(key => methods.set(key, classes[ key ]));
            }
            let err            = new Error('invalid wrapClassList set params');
            err[ 'arguments' ] = arguments;
            throw err;
        },
    };
    const methodNames = Object.keys(methods);
    const proxy       = new Proxy(list, {
        get(target: DOMTokenList, p: string | number | symbol, receiver: any): any {
            if ( methodNames.includes(p.toString()) ) {
                return methods[ p ];
            }
            return target[ p ];
        },
    });
    return proxy as WrappedClassList;
}
