
function stripRight(str: string, right: string): string {
    if ( str.endsWith(right) ) {
        return str.substr(0, str.length - right.length);
    }
    return str;
}
export default stripRight
