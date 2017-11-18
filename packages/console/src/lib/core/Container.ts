import { Container as BaseContainer, decorate, inject as _inject, injectable as _injectable, interfaces, postConstruct } from "inversify";
import { makeFluentProvideDecorator, makeProvideDecorator } from "inversify-binding-decorators";
import getDecorators from "inversify-inject-decorators";
import Newable = interfaces.Newable;
import Abstract = interfaces.Abstract;



export type ServiceIdentifier = interfaces.ServiceIdentifier<any>;

export class Container extends BaseContainer {

    /**
     * Create an instance of a class using the container, making it injectable at runtime and able to @inject on the fly
     * @param cls
     * @param factoryMethod
     * @returns {T}
     */
    build<T>(cls: any, factoryMethod?: (context: interfaces.Context) => any): T {

        if ( factoryMethod ) {
            this.ensureInjectable(cls);
            let k = 'temporary.kernel.binding';
            this.bind(k).toFactory<any>(factoryMethod);
            let instance = this.get<T>(k);
            this.unbind(k);
            return instance;

        }
        return this.resolve<T>(cls);

    }

    /**
     * make binds the class in the IoC container if not already bound. then returns the bound instance
     *
     * @param cls
     * @returns {T}
     */
    make<T>(cls: any): T {
        return this.resolve<T>(cls);
    }


    getParentClasses(cls: Function, classes: Function[] = []): Function[] {
        if ( cls[ '__proto__' ] !== null ) {
            classes.push(cls);
            return this.getParentClasses(cls[ '__proto__' ], classes)
        }
        return classes;
    }

    ensureInjectable(cls: Function) {
        // let parents = this.getParentClasses(cls);
        //
        // parents.shift();

        try { decorate(injectable(), cls); } catch ( err ) {
            // console.log('ensureInjectable', err)
        }
    }

    bindTo(id: ServiceIdentifier) {
        return provide(id);
    }

    lazyInject(id: ServiceIdentifier) {
        return lazyInject(id);
    }

    singleton(id: ServiceIdentifier, cls: any) {
        this.ensureInjectable(cls);
        this.bind(id).to(cls).inSingletonScope();
    }

    inject(id: ServiceIdentifier): (target: any, targetKey: string, index?: number | undefined) => void {
        return <any> inject(id);
    }

    injectable() {
        return _injectable();
    }

    decorate(decorator: (ClassDecorator | ParameterDecorator), target: any, parameterIndex?: number) {
        return decorate(decorator, target, parameterIndex);
    }

    constant<T>(id: string, val: T) {
        return this.bind(id).toConstantValue(val);
    }
}

export const container: Container = new Container()

export const injectable = () => _injectable()
export const lazyInject:any = getDecorators(container as any).lazyInject;
export const provide:any    = makeProvideDecorator(container as any);
const fprovide  = makeFluentProvideDecorator(container as any);

export function singleton (identifier: ServiceIdentifier) : ClassDecorator {
    return (cls:any) => {
        container.ensureInjectable(cls);
        container.bind(identifier).to(cls).inSingletonScope();
    }
};

export const inject = (id: ServiceIdentifier) => {
    return _inject(id);
}
export const bindTo = (id: ServiceIdentifier) => {
    return container.bindTo(id);
}
export {Newable, Abstract}
export { postConstruct } from 'inversify'
export { autoProvide, makeFluentProvideDecorator, makeProvideDecorator } from 'inversify-binding-decorators'
export * from 'inversify-inject-decorators'