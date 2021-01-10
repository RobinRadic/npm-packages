import 'reflect-metadata';
import { inspect } from 'util';
import { meta }    from './util';

const r  = Reflect;
const rg = Reflect.getMetadata;
const rd = Reflect.defineMetadata;

const check = (value) => {
    let result = inspect(value, {
        showHidden    : true,
        colors        : true,
        compact       : false,
        maxArrayLength: Infinity,
        showProxy     : true,
        depth         : Infinity,
    });
    process.stdout.write(result, 'utf8', err => {
        console.error('error occurred for check:', err);
    });
};


const CLASS_KEY  = Symbol('CLASS_KEY');
const PROP_KEY   = Symbol('PROP_KEY');
const PARAM_KEY  = Symbol('PARAM_KEY');
const METHOD_KEY = Symbol('METHOD_KEY');


function classDecorator(...args: any[]): ClassDecorator {
    return target => {
        r.defineMetadata(CLASS_KEY, { type: 'classDecorator' }, target);
        let all = meta('class', target).get();
        result  = {
            CLASS_KEY : rg(CLASS_KEY, target),
            PROP_KEY  : rg(PROP_KEY, target),
            PARAM_KEY : rg(PARAM_KEY, target),
            METHOD_KEY: rg(METHOD_KEY, target),
        };

        class Test2 extends (target as any) {
            foobar = 1;
        }

        return Test2 as any;
    };
}

function propertyDecorator(...args: any[]): PropertyDecorator {
    return (target, propertyKey) => {
        meta('class', target, propertyKey).set(propertyKey, r.getMetadata('design:type', target, propertyKey));
    };
}

function parameterDecorator(...args: any[]): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        meta('class', target, parameterIndex).set(propertyKey, parameterIndex);
    };
}

function methodDecorator(...args: any[]): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        meta('class', target, propertyKey, descriptor).set(propertyKey, descriptor);
    };
}

@classDecorator()
class Test {
    @propertyDecorator()
    prop1: number;
    foo: string;

    constructor(foo = 'a') {
        this.foo = foo;
    }

    @methodDecorator()
    tester(
        @parameterDecorator() param: string,
    ) {
        console.log(param);
    }
}


let result = {
    CLASS_KEY : rg(CLASS_KEY, Test),
    PROP_KEY  : rg(PROP_KEY, Test),
    PARAM_KEY : rg(PARAM_KEY, Test),
    METHOD_KEY: rg(METHOD_KEY, Test),
};
let test   = new Test('bar');

let result2 = {
    CLASS_KEY : rg(CLASS_KEY, test),
    PROP_KEY  : rg(PROP_KEY, test),
    PARAM_KEY : rg(PARAM_KEY, test),
    METHOD_KEY: rg(METHOD_KEY, test),
};

check({ result });
check({ result2 });


let a = 'a';
// class MetaRegistry {
//     static metas: Meta[] = [];
//
//     static binding(target: any) {
//         let type = typeof target
//         let name;
//         let realTarget;
//
//         if ( type === 'function' ) {
//             name = target.name;
//             realTarget = target;
//         }
//         if ( type === 'object' ) { // if ( 'constructor' in target ) {
//             name = target.constructor.name;
//             realTarget = target.constructor;
//         }
//         if ( name ) {
//             let meta = this.metas.find(meta => meta.name === name);
//             if ( !meta ) {
//                 meta = new Meta(name, realTarget);
//                 this.metas.push(meta);
//             }
//             return meta;
//         }
//     }
//
// }
