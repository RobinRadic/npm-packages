import 'reflect-metadata';
import { meta, r, rget } from './util';


function classDecorator(...args: any[]): ClassDecorator {
    return target => {
        let all   = meta(target).get();
        let param = meta(target).get();

        class Test2 extends (target as any) {
            foobar = 1;
        }

        return Test2 as any;
    };
}

function propertyDecorator(options:any={}): PropertyDecorator {
    return (target, propertyKey) => {
        meta(target).set(`props.${propertyKey.toString()}`, {
            type: rget('design:type', target, propertyKey)
        });
    };
}

function parameterDecorator(options: any={}): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        let type = rget('design:type', target, propertyKey);
        meta(target).set(`params.${propertyKey.toString()}`, {
            parameterIndex,
            type,
            options,
        });
    };
}

function methodDecorator(options: any={}): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        meta(target).set(`methods.${propertyKey.toString()}`, descriptor);
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
        @parameterDecorator({ a: 'cv' }) param: string,
    ) {
        console.log(param);
    }
}


