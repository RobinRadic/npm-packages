import { ValueOf }          from './interfaces';
import { kindsOf, KindsOf } from './kindsOf';

export type KindOf = ValueOf<KindsOf>

let nativeTrim = String.prototype.trim;
let entityMap  = {
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;',
    '"' : '&quot;',
    '\'': '&#39;',
    '/' : '&#x2F;',
};

export function kindOf(value: any): KindOf {
    // Null or undefined.
    if ( value == null ) {
        return String(value) as any;
    }
    // Everything else.
    return kindsOf[ kindsOf.toString.call(value) ] || 'object';
}
