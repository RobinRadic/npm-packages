import getParts from "./getParts";
import get from "./get";

/**
 * Set a value of a child of the object using dot notation
 * @param obj
 * @param parts
 * @param value
 * @returns {any}
 */
function set(obj, parts, value) {
    parts = getParts(parts);

    var prop = parts.pop();
    obj      = get(obj, parts, true);
    if ( obj && typeof obj === 'object' ) {
        return (obj[ prop ] = value);
    }
}
export default set
