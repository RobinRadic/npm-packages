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

    applyProxy<O extends object>(object: O, parent = null): O {
        const self  = this;
        const proxy = new Proxy<O>(object, {
            get(target: any, p: string | number | symbol, receiver: any): any {
                let value = Reflect.get(target, p, receiver);
                if ( p === OBSERVER ) {
                    return target[ OBSERVER ];
                }
                if ( typeof value === 'object' ) {
                    value = self.applyProxy(value, parent ? `${parent}.${p.toString()}` : p.toString());
                }
                return value;
            },
            set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
                let has      = Reflect.has(target, p);
                let oldValue = Reflect.get(target, p, receiver);
                let res      = Reflect.set(target, p, value, receiver);
                if ( res ) {
                    let type: ObserverChangedType = has ? 'update' : 'add';
                    self.callSubscribers(self.createChanged(type, target, (parent ? `${parent}.${p.toString()}` : p.toString()), value, oldValue));
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
}
