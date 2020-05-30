
function getParts(str:string): string[] {
    return str.replace(/\\\./g, '\uffff').split('.').map(function (s) {
        return s.replace(/\uffff/g, '.');
    });
}
export default getParts
