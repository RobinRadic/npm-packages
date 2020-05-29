function ensureRight(str: string, right: string): string {
    if ( false === str.endsWith(right) ) {
        return right + str;
    }
    return str;
}

export default ensureRight;
