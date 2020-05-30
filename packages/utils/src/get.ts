import getParts from './getParts';


/**
 * Get a child of the object using dot notation
 * @param obj
 * @param parts
 * @param defaultValue
 * @param create
 * @returns {any}
 */
function get(obj?: any, parts?: any, defaultValue?:any, create: boolean=false): any {
    if ( typeof parts === 'string' ) {
        parts = getParts(parts);
    }

    var part;
    while ( typeof obj === 'object' && obj && parts.length ) {
        part = parts.shift();
        if ( !(part in obj) ) {
            if(create) {
                obj[ part ] = {};
            } else {
                return defaultValue;
            }
        }
        obj = obj[ part ];
    }

    return obj;
}

export default get;
