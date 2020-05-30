function ensureRight(str: string, right: string): string {
    if ( false === str.endsWith(right) ) {
        return str + right;
    }
    return str;
}

export default ensureRight;
