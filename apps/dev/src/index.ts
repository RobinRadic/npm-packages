import 'reflect-metadata'
import {  Storage } from '@radic/util';

// import {get,set,has,unset} from 'lodash'
export const a = Reflect.get({
    a: {
        a: 'b'
    }
}, 'a')

export const store = new Storage()
console.dir({a,store})
// export const config = new Config({
//     a: 'a',
// });
