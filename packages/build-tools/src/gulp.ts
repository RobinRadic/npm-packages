import { Deferred } from 'q';
import { Input } from './input';
import { Output } from './output';

export abstract class GulpTasks {
    get out(): Output { return require('./output').output }

    get ask(): Input { return require('./input').input }

    defer<T>(): Deferred<T> { return require('q').defer() as Deferred<T> }
}