
export function strEnsureLeft(str: string, left: string): string {
    if ( false === str.startsWith(left) ) {
        return left + str;
    }
    return str;
}

export function strEnsureRight(str: string, right: string): string {
    if ( false === str.endsWith(right) ) {
        return right + str;
    }
    return str;
}

export function strStripLeft(str: string, left: string): string {
    if ( str.startsWith(left) ) {
        return str.substr(left.length);
    }
    return str;
}

export function strStripRight(str: string, right: string): string {
    if ( str.endsWith(right) ) {
        return str.substr(0, str.length - right.length);
    }
    return str;
}
export function escapeRegExp(s:string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};