export function canAccessAsArray(item:any):boolean {
    if (Array.isArray(item)) {
        return true;
    }
    // modern browser such as IE9 / firefox / chrome etc.
    var result = Object.prototype.toString.call(item);
    if (result === "[object HTMLCollection]" || result === "[object NodeList]") {
        return true;
    }
    //ie 6/7/8
    if (typeof item !== "object" || !item.hasOwnProperty("length") || item.length < 0) {
        return false;
    }
    // a false positive on an empty pseudo-array is OK because there won't be anything
    // to iterate so we allow anything with .length === 0 to pass the test
    if (item.length === 0) {
        return true;
    } else if (item[0] && item[0].nodeType) {
        return true;
    }
    return false;
}
