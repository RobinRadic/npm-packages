import { ValueOf } from './interfaces';
import { KindsOf } from './kindsOf';
export declare type KindOf = ValueOf<KindsOf>;
export declare function kindOf(value: any): KindOf;
