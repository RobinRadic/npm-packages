export function collect(items) {
    return new Collection(...items);
}
export class Collection extends Array {
    constructor(...items) {
        super(...items);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static make(items = []) { return new (this)(...items); }
    isEmpty() { return this.length === 0; }
    isNotEmpty() { return this.length > 0; }
    first() { return this[0]; }
    last() { return this[this.length - 1]; }
    findBy(key, value) { return this.find(item => item[key] === value); }
    where(key, value) { return this.newInstance(...this.filter(item => item[key] === value)); }
    whereIn(key, values) { return this.newInstance(...this.filter(item => values.includes(item[key]) === true)); }
    whereNotIn(key, values) { return this.newInstance(...this.filter(item => values.includes(item[key]) === false)); }
    each(callbackfn) {
        this.forEach(callbackfn);
        return this;
    }
    newInstance(...items) {
        let Class = this.constructor;
        let instance = new Class(...items);
        return instance;
    }
    keyBy(key) {
        let cb = key;
        if (typeof key === 'string') {
            cb = item => item[key];
        }
        let result = {};
        this.forEach(item => {
            let key = cb(item);
            result[key] = item;
        });
        return result;
    }
    mapKeyBy(key) {
        let cb = key;
        if (typeof key === 'string') {
            cb = item => item[key];
        }
        let result = new Map();
        this.forEach(item => {
            let key = cb(item);
            result.set(key, item);
        });
        return result;
    }
}
export class NodeArray extends Collection {
    item(key) { return this[key]; }
    hasItem(key) { return this[key] !== undefined; }
    depth(depth) { return this.filter(item => item.getDepth() === depth); }
    root() { return this.filter(item => item.isRoot); }
    without(item) { return this.filter(i => !item.includes(i)); }
    only(item) { return this.filter(i => item.includes(i)); }
}
//# sourceMappingURL=collections.js.map