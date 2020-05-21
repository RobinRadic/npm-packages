import { OBSERVER }                             from './constants';
import { IObservable, ObserverChangedFunction } from './types';
import { Observable }                           from './Observable';

export function observable<T extends object>(object: T): IObservable<T> {//: T & { [ OBSERVER ]: Observable<T> } {
    let observable       = new Observable<T>(object);
    let observableObject = observable.proxy;
    return observable.proxy as any;
}

// export function observe<T extends object>(object: T & { [ OBSERVER ]?: Observable<T> }, changeCallback: ObserverChangedFunction) {
export function observe<T extends object>(object: IObservable<T>, changeCallback: ObserverChangedFunction) {
    if ( object[ OBSERVER ] ) {

    }
    return object[ OBSERVER ].subscribe(changeCallback);
}
