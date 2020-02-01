import { ValueOf } from './interfaces';

export interface KindsOf {
    '[object Number]': 'number'
    '[object String]': 'string'
    '[object Boolean]': 'boolean'
    '[object Function]': 'function'
    '[object RegExp]': 'regexp'
    '[object Array]': 'array'
    '[object Date]': 'date'
    '[object Error]': 'error'
}


export let kindsOf: KindsOf = {} as KindsOf;
'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function (k) {
    kindsOf[ '[object ' + k + ']' ] = k.toLowerCase()

});
