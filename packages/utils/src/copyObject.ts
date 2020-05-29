/**
 * Copy an object, creating a new object and leaving the old intact
 * @param object
 * @returns {T}
 */
function copyObject<T>(object: T): T {
    var objectCopy = <T>{};

    for ( var key in object ) {
        if ( object.hasOwnProperty(key) ) {
            objectCopy[ key ] = object[ key ];
        }
    }

    return objectCopy;
}

export default copyObject;
