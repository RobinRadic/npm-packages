import { Container, interfaces } from 'inversify';

export class Application extends Container {


    protected static _instance: Application;
    public static get instance(): Application {
        if ( !Application._instance ) {
            Application._instance = new Application();
        }
        return Application._instance;
    }

    constructor() {
        super({
            defaultScope       : 'Transient',
            autoBindInjectable : true,
            skipBaseClassChecks: false,
        });
        Application._instance = this;
        this.bind(Application).toConstantValue(this);
        // this.alias(Application, 'app', true);
        this.bind('app').toConstantValue(this);
    }

    //region: ioc
    public alias<T, A>(abstract: interfaces.ServiceIdentifier<T>, alias: interfaces.ServiceIdentifier<A>, singleton: boolean = false) {
        let binding = this.bind(alias).toDynamicValue(ctx => ctx.container.get(abstract as any));
        if ( singleton ) {
            binding.inSingletonScope();
        }
        return this;
    }

    protected bindIf<T>(id, override: boolean = false, cb: (binding: interfaces.BindingToSyntax<T>) => void): this {
        if ( this.isBound(id) && !override ) return this;
        cb(this.isBound(id) ? this.rebind(id) : this.bind(id));
        return this;
    }

    public dynamic<T>(id: interfaces.ServiceIdentifier<T>, cb: (app: Application) => T) {
        return this.bind(id).toDynamicValue(ctx => {
            let req = ctx.currentRequest;
            return cb(this);
        });
    }

    public singleton<T>(id: interfaces.ServiceIdentifier<T>, value: any, override: boolean = false): this {
        return this.bindIf(id, override, b => b.to(value).inSingletonScope());
    }

    public binding<T, T2>(id: interfaces.ServiceIdentifier<T>, value: (app: Application) => T2, override: boolean = false): this {
        let result   = null;
        let resolved = false;
        this.bind<any>(id).toFactory<any>(ctx => {
            if ( !resolved ) {
                result   = value(ctx.container as any) as any;
                resolved = true;
            }
            return result;
        });
        return this;
    }

    public instance<T>(id: interfaces.ServiceIdentifier<T>, value: any, override: boolean = false): this {
        return this.bindIf(id, override, b => b.toConstantValue(value));
    }

    public ctxfactory<T, T2>(id: interfaces.ServiceIdentifier<T>, factory: ((ctx: interfaces.Context) => (...args: any[]) => T2)) {
        this.bind(id).toFactory(ctx => factory(ctx));
        return this;
    }

    public factory<T, T2>(id: interfaces.ServiceIdentifier<T>, factory: ((...args: any[]) => T2)) {
        this.bind(id).toFactory(ctx => factory);
        return this;
    }

    //endregion
}
