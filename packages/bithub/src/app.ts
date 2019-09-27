import getDecorators from 'inversify-inject-decorators';
// noinspection ES6UnusedImports
import { autoProvide, buildProviderModule, fluentProvide, provide } from 'inversify-binding-decorators';
import { Application } from './classes/Application';
import { interfaces } from 'inversify';


export const app = Application.instance; //new Application();

const decorators = getDecorators(app);

export const inject = (serviceProvider?: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>): PropertyDecorator => {
    return (proto, key: any) => {
        if ( serviceProvider == null ) {
            serviceProvider = key;
        }
        let res = decorators.lazyInject(serviceProvider);
        return res(proto, key);
    };
    // return res;
};

export const singleton = (id?: interfaces.ServiceIdentifier<any>): ClassDecorator => {
    return target => {

        return fluentProvide(id || target).inSingletonScope().done()(target);
    };
};


