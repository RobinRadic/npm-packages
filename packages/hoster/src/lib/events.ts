import { EventEmitter } from 'events';

export interface Events {
    on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export class Events extends EventEmitter {

}

export const events = new Events();
