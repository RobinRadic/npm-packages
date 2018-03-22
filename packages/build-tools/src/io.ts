import { Output } from './output';
import { Input } from './input';
import { Mixin } from './lib/mixins';

export interface IO extends Input, Output {}

@Mixin(Input)
@Mixin(Output)
export class IO {

}

const io = new IO;