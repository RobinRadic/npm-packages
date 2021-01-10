import 'reflect-metadata';
import { inspect } from 'util';

const r = Reflect;


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


function classDecorator(...args: any[]): ClassDecorator {
    return Cls => {
        Cls.prototype;
        data.classDecorator = { target: Cls.prototype };
        push('classDecorator', Cls.prototype, { args });
    };
}

function propertyDecorator(...args: any[]): PropertyDecorator {
    return (target, propertyKey) => {
        data.propertyDecorator = { target, propertyKey };
        push('propertyDecorator', target, { propertyKey });
    };
}

function parameterDecorator(...args: any[]): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        data.parameterDecorator = { target, propertyKey, parameterIndex };
        push('parameterDecorator', target, { propertyKey, parameterIndex });
    };
}

function methodDecorator(...args: any[]): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        data.methodDecorator = { target, propertyKey, descriptor };
        push('methodDecorator', target, { propertyKey, descriptor });
    };
}

abstract class BaseBaseTest {
    foo: string;

    constructor(foo = 'a') {
        this.foo = foo;
    }
}

abstract class BaseTest extends BaseBaseTest {

    constructor(foo = 'a') {
        super(foo);
    }
}

@classDecorator()
class Test extends BaseTest {
    @propertyDecorator()
    prop1: number;

    constructor(foo = 'a') {
        super(foo);
    }

    @methodDecorator()
    tester(
        @parameterDecorator() param: string,
    ) {
        console.log(param);
    }
}


let test = new Test('asdf');


let a = 'a';
