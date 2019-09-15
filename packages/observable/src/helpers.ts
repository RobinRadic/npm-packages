import { OBSERVER } from './constants';
import { ObserverChangedFunction } from './types';
import { Observable } from './Observable';

export function observable<T extends object>(object: T): T & { [ OBSERVER ]: Observable<T> } {
    return Observable.create(object);
}

export function observer<T extends object>(object: T): Observable<T> {
    return Observable.observer(object);
}

export function observe<T extends object>(object: T & { [ OBSERVER ]?: Observable<T> }, changeCallback: ObserverChangedFunction) {
    return Observable.observe(object, changeCallback);
}
