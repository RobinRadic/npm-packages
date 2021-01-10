import 'reflect-metadata';
import { inspect } from 'util';

const r = Reflect;
const rg = Reflect.getMetadata
const rd= Reflect.defineMetadata

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

const data = {
    classDecorator    : null,
    propertyDecorator : null,
    parameterDecorator: null,
    methodDecorator   : null,
};


const datas = [];
const push  = (type, target, data?: any) => datas.push({ type, target, data });

const CLASS_KEY = Symbol('CLASS_KEY');
const PROP_KEY = Symbol('PROP_KEY');
const PARAM_KEY = Symbol('PARAM_KEY');
const METHOD_KEY = Symbol('METHOD_KEY');

function classDecorator(...args: any[]): ClassDecorator {
    return target => {
        r.defineMetadata(CLASS_KEY, {type:'classDecorator'}, target);

        let  result = {
            CLASS_KEY: rg(CLASS_KEY,target),
            PROP_KEY: rg(PROP_KEY,target),
            PARAM_KEY: rg(PARAM_KEY,target),
            METHOD_KEY: rg(METHOD_KEY,target),
        }
        data.classDecorator = { target };
        push('classDecorator', target, { args });

        class Test2 extends (target as any) {
            foobar = 1;
        }

        return Test2 as any
    };
}

function propertyDecorator(...args: any[]): PropertyDecorator {
    return (target, propertyKey) => {
        r.defineMetadata(PROP_KEY, {type:'propertyDecorator', propertyKey}, target);
        r.defineMetadata(PROP_KEY, {type:'propertyDecorator', propertyKey}, target.constructor);
        data.propertyDecorator = { target, propertyKey };
        push('propertyDecorator', target, { propertyKey });
    };
}

function parameterDecorator(...args: any[]): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        r.defineMetadata(PARAM_KEY, {type:'parameterDecorator', propertyKey, parameterIndex}, target);
        r.defineMetadata(PARAM_KEY, {type:'parameterDecorator', propertyKey, parameterIndex}, target.constructor);
        data.parameterDecorator = { target, propertyKey, parameterIndex };
        push('parameterDecorator', target, { propertyKey, parameterIndex });
    };
}

function methodDecorator(...args: any[]): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        r.defineMetadata(METHOD_KEY, {type:'methodDecorator', propertyKey, descriptor}, target);
        r.defineMetadata(METHOD_KEY, {type:'methodDecorator', propertyKey, descriptor}, target.constructor);
        data.methodDecorator = { target, propertyKey, descriptor };
        push('methodDecorator', target, { propertyKey, descriptor });
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



let  result = {
    CLASS_KEY: rg(CLASS_KEY,Test),
    PROP_KEY: rg(PROP_KEY,Test),
    PARAM_KEY: rg(PARAM_KEY,Test),
    METHOD_KEY: rg(METHOD_KEY,Test),
}
let test = new Test('bar');

let  result2 = {
    CLASS_KEY: rg(CLASS_KEY,test),
    PROP_KEY: rg(PROP_KEY,test),
    PARAM_KEY: rg(PARAM_KEY,test),
    METHOD_KEY: rg(METHOD_KEY,test),
}

check({ data })
check({ datas })
check({ result })
check({ result2 })


let a = 'a';
