import { strHas } from './utils';
import { Site }   from './Site';

export class SiteArray<T extends Site = Site> extends Array<T> implements Array<T> {
    filter: (callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any) => this;

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    enabled() {return this.filter(s => s.enabled);}

    disabled() {return this.filter(s => !s.enabled);}

    enable() {return this.forEach(s => s.enable());}

    disable() {return this.forEach(s => s.disable());}

    get(name: string) {return this.find(s => s.name === name);}

    search(nameSegment: string) {return this.filter(s => strHas(nameSegment).test(s.name));}
}
