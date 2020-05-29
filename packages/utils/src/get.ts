import getParts from './getParts';


/**
 * Get a child of the object using dot notation
 * @param obj
 * @param parts
 * @param create
 * @returns {any}
 */
function get(obj?: any, parts?: any, create?: any): any {
    if ( typeof parts === 'string' ) {
        parts = getParts(parts);
    }

    var part;
    while ( typeof obj === 'object' && obj && parts.length ) {
        part = parts.shift();
        if ( !(part in obj) && create ) {
            obj[ part ] = {};
        }
        obj = obj[ part ];
    }

    return obj;
}

export default get;
