import { Output } from './output';
import { Input } from './input';
import { Mixin } from '@radic/util';


export interface IO extends Input, Output {}

export class IO extends Mixin(Input, Output) {
}

export const io = new IO
