import { OBSERVER } from './constants';
import { ObserverChanged, ObserverChangedFunction, ObserverChangedType, ObserverSubscription } from './types';

export class Observable<T extends object> {
    public readonly subscribers: ObserverChangedFunction[] = [];
    public readonly proxy: T;

    constructor(public readonly object: T) {
        this.proxy = this.applyProxy(object);
        const self = this;
        Object.defineProperty(object, OBSERVER, {
            get(): any {
                return self;
            },
        });
        // Object.defineProperty(this.proxy, OBSERVER, {
        //     get(): any {
        //         return self
        //     },
        // })
    }

    subscribe(change: ObserverChangedFunction): ObserverSubscription {
        let subcriptionIndex = this.subscribers.push(change);
        return {
            unsubscribe: () => this.subscribers.splice(subcriptionIndex + 1, 1),
        };
    }

    createChanged(type: ObserverChangedType, object, name, newValue?: any, oldValue?: any): ObserverChanged {
        return { type, object, name, newValue, oldValue };
    }

    callSubscribers(changed: ObserverChanged) {
        this.subscribers.forEach(subscriber => {
            subscriber(changed); //.call(subscriber, 1)
        });
    }

    applyProxy<O extends object>(object: O, parents: string[] = []): O {
        const self  = this;
        const proxy = new Proxy<O>(object, {
            get(target: any, p: string | number | symbol, receiver: any): any {
                let value = Reflect.get(target, p, receiver);
                let name  = p.toString().split('.');
                if ( p === OBSERVER ) {
                    return target[ OBSERVER ];
                }
                if ( typeof value === 'object' ) {
                    value = self.applyProxy(value, parents.concat(p.toString()));
                }
                return value;
            },
            set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
                let has      = Reflect.has(target, p);
                let oldValue = Reflect.get(target, p, receiver);
                let res      = Reflect.set(target, p, value, receiver);
                if ( res ) {
                    let type: ObserverChangedType = has ? 'update' : 'add';
                    let name                      = parents.concat(p.toString()).join('.');
                    self.callSubscribers(self.createChanged(type, target, name, value, oldValue));
                }
                return res;
            },
            deleteProperty(target: any, p: string | number | symbol): boolean {
                let res = Reflect.deleteProperty(target, p);
                if ( res ) {
                    self.callSubscribers(self.createChanged('delete', target, p));
                }
                return res;
            },
            has(target: O, p: string | number | symbol): boolean {
                return Reflect.deleteProperty(target, p);
            },
        });
        return proxy;
    }

    static create<T extends object>(object: T): T & { [ OBSERVER ]: Observable<T> } {
        let observable = new Observable<T>(object);
        return observable.proxy as any;
    }

    static observer<T extends object>(object: T): Observable<T> {
        return object[ OBSERVER ];
    }

    static observe<T extends object>(object: T & { [ OBSERVER ]?: Observable<T> }, changeCallback: ObserverChangedFunction) {
        return object[ OBSERVER ].subscribe(changeCallback);
    }
}
