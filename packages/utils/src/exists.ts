import getParts from './getParts';
import get      from './get';

/**
 * Check if a child of the object exists using dot notation
 * @param obj
 * @param parts
 * @returns {boolean|any}
 */
function exists(obj, parts) {
    parts = getParts(parts);

    var prop = parts.pop();
    obj      = get(obj, parts);

    return typeof obj === 'object' && obj && prop in obj;
}

export default exists;
