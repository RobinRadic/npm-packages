function ensureLeft(str: string, left: string): string {
    if ( false === str.startsWith(left) ) {
        return left + str;
    }
    return str;
}

export default ensureLeft;
