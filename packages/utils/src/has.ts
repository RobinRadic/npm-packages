import getParts from './getParts';
import get      from './get';
import kindOf   from './kindOf';

/**
 * Check if a child of the object exists using dot notation
 * @param obj
 * @param parts
 * @returns {boolean|any}
 */
function has(obj: object, parts: string) {
    if ( kindOf(parts) !== 'string' ) {
        throw new Error('has(obj,parts) > parts should be a string');
    }
    let _parts = getParts(parts);

    var prop = _parts.pop();
    obj      = get(obj, _parts);

    return typeof obj === 'object' && obj && prop in obj;
}

export default has;

