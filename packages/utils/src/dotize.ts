
/**
 * Flatten an object to a dot notated associative array
 * @param obj
 * @param prefix
 * @returns {any}
 */
function dotize(obj: any, prefix?: any) {
    if ( ! obj || typeof obj != 'object' ) {
        if ( prefix ) {
            var newObj       = {};
            newObj[ prefix ] = obj;
            return newObj;
        }
        else
            return obj;
    }

    var newObj = {};

    function recurse(o: any, p: any, isArrayItem?: any) {
        for ( var f in o ) {
            if ( o[ f ] && typeof o[ f ] === 'object' ) {
                if ( Array.isArray(o[ f ]) )
                    newObj = recurse(o[ f ], (p ? p : '') + (isNumber(f) ? '[' + f + ']' : '.' + f), true); // array
                else {
                    if ( isArrayItem )
                        newObj = recurse(o[ f ], (p ? p : '') + '[' + f + ']'); // array item object
                    else
                        newObj = recurse(o[ f ], (p ? p + '.' : '') + f); // object
                }
            }
            else {
                if ( isArrayItem || isNumber(f) )
                    newObj[ p + '[' + f + ']' ] = o[ f ]; // array item primitive
                else
                    newObj[ (p ? p + '.' : '') + f ] = o[ f ]; // primitive
            }
        }

        if ( isEmptyObj(newObj) )
            return obj;

        return newObj;
    }

    function isNumber(f) {
        return ! isNaN(parseInt(f));
    }

    function isEmptyObj(obj) {
        for ( var prop in obj ) {
            if ( obj.hasOwnProperty(prop) )
                return false;
        }

        return true;
    }

    return recurse(obj, prefix);
}
export default dotize
