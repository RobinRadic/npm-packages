import { ValueOf }          from './interfaces';
import kindsOf, { KindsOf } from './kindsOf';

export type KindOf = ValueOf<KindsOf>

function kindOf(value: any): KindOf {
    // Null or undefined.
    if ( value == null ) {
        return String(value) as any;
    }
    // Everything else.
    return kindsOf[ kindsOf.toString.call(value) ] || 'object';
}

export default kindOf;
