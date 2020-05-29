import kindOf from './kindOf';

function recurse(value: Object, fn: Function, fnContinue?: Function): any {
    function recurse(value, fn, fnContinue, state) {
        var error;
        if ( state.objs.indexOf(value) !== - 1 ) {
            error      = new Error('Circular reference detected (' + state.path + ')');
            error.path = state.path;
            throw error;
        }

        var obj, key;
        if ( fnContinue && fnContinue(value) === false ) {
            // Skip value if necessary.
            return value;
        }
        else if ( kindOf(value) === 'array' ) {
            // If value is an array, recurse.
            return value.map(function (item, index) {
                return recurse(item, fn, fnContinue, {
                    objs: state.objs.concat([ value ]),
                    path: state.path + '[' + index + ']'
                });
            });
        }
        else if ( typeof value === 'object' ) {
            // If value is an object, recurse.
            obj = {};
            for ( key in value ) {
                obj[ key ] = recurse(value[ key ], fn, fnContinue, {
                    objs: state.objs.concat([ value ]),
                    path: state.path + (/\W/.test(key) ? '["' + key + '"]' : '.' + key)
                });
            }
            return obj;
        }
        else {
            // Otherwise pass value into fn and return.
            return fn(value);
        }
    }

    return recurse(value, fn, fnContinue, { objs: [], path: '' });
}
export default recurse

