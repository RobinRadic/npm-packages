
function stripLeft(str: string, left: string): string {
    if ( str.startsWith(left) ) {
        return str.substr(left.length);
    }
    return str;
}
export default stripLeft
