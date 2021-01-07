import Chain, { Rule }                                   from 'webpack-chain';
import { Configuration }                                 from 'webpack';
import { init }                                          from '../init';
import { dirname, isAbsolute, normalize, resolve }       from 'path';
import { existsSync, statSync, symlinkSync, unlinkSync } from 'fs';
import { merge }                                         from 'lodash';
import { EventEmitter }                                  from 'events';
import { createExitHandler }                             from '../utils/exitHandler';
import { blocks }                                        from '../blocks';
import { SyncHook, SyncWaterfallHook }                   from 'tapable';
import { Dependencies }                                  from './Dependencies';
import { Config }                                        from './Config';
import { PackageJSON }                                   from 'gluegun/build/types/toolbox/meta-types';

import { BabelLoaderOptions, Blocks, Mode, PluginBlockFunction, PluginDefinition, PluginDefinitionFunction, RuleDefinition, RuleDefinitionBlockFunction, RuleDefinitionFunction } from '../interfaces';

let a               = Object.getPrototypeOf(Chain.prototype);
let b               = a.constructor;
let c               = Object.getPrototypeOf(b);
c.prototype.depends = function (...dev: string[]) {
    this._root().depends(...dev);
    return this;
};
c.prototype._root   = function () {
    let parent = this;
    while ( parent ) {
        if ( parent.parent === undefined ) {
            return parent;
        }
        parent = parent.parent;
    }
};

export type ChainWithStore<Chain, Name extends keyof Configuration> = Chain & {
    store: Map<keyof Configuration[Name], any>
}

export interface Webpacker {
    constructor: typeof Webpacker
}

export interface WebpackerConstructorOptions {
    mode: Mode
    path: string
    // installMissingDependencies?: boolean
    outputPath?: string
    contextPath?: string
    sourceMap?: boolean
    workspace?: string // disabled if not defined. if path defined(to workspace dir/package.json) then workspaces enabled
}

export interface WebpackerSettings {
    [ key: string ]: any

    path: string
    outputPath: string
    contextPath: string
    sourceMap: boolean
    workspacesEnabled: boolean
    workspacesDirectory?: string
    // installMissingDependencies?: boolean
    babel: BabelLoaderOptions
}

export interface Mapper<ConfigKey extends keyof Configuration, Config = Configuration[ConfigKey]> extends Map<keyof Config, any> {
    get<K extends keyof Config>(key: K): Config[K]
}

export class Webpacker extends Chain {
    devServer: Chain.DevServer & { store: Mapper<'devServer'> };
    module: Chain.Module & { store: Mapper<'module'> };
    output: Chain.Output & { store: Mapper<'output'> };
    optimization: Chain.Optimization & { store: Mapper<'optimization'> };
    performance: Chain.Performance & { store: Mapper<'performance'> };
    plugins: Chain.Plugins<this> & { store: Mapper<'plugins'> };
    resolve: Chain.Resolve & { store: Mapper<'resolve'> };
    resolveLoader: Chain.ResolveLoader & { store: Mapper<'resolveLoader'> };

    public static init                                                 = init;
    public static defaultSettings: Partial<WebpackerSettings>          = {
        contextPath      : 'src',
        sourceMap        : false,
        workspacesEnabled: false,
        // installMissingDependencies: true,
        babel            : {
            babelrc       : false,
            configFile    : false,
            cacheDirectory: true,
            'sourceMaps'  : true,
            presets       : [],
            plugins       : [],
        },
    };
    public static defaultOptions: Partial<WebpackerConstructorOptions> = {
        contextPath: 'src',
        sourceMap  : false,
        mode       : 'development',
    };

    public readonly store: Map<keyof Configuration, any>;
    public readonly settings: Config.Proxied<WebpackerSettings>;

    protected _mode: Mode;
    protected _depends: Dependencies;
    protected _events: EventEmitter;

    public static precheck() {
        if ( [ 'development', 'production' ].includes(process.env.NODE_ENV) === false ) {
            throw new Error(`NODE_ENV not set to either 'development' or 'production'`);
        }
    }

    constructor(options: WebpackerConstructorOptions) {
        super();
        options = {
            ...new.target.defaultOptions,
            ...options,
        };
        this.mode(options.mode);
        this.settings = Config.proxied<WebpackerSettings>(new.target.defaultSettings) as any;
        this.settings.onChange('workspacesDirectory', (set) => {
            let stat = statSync(set.value);
            if ( stat.isDirectory() ) {
                set.value = normalize(set.value);
            } else if ( stat.isFile() ) {
                set.value = normalize(dirname(set.value));
            } else {
                throw new Error('invalid workspace option given');
            }
            if ( !existsSync(resolve(set.value, 'package.json')) ) {
                throw new Error('invalid workspace option given: ' + set.value);
            }
        });
        this._events  = new EventEmitter();
        this._depends = new Dependencies();


        options             = {
            ...this.constructor.defaultSettings,
            outputPath: this.isProd ? 'prod' : 'dev',
            ...options,
        };
        options.outputPath  = isAbsolute(options.outputPath) ? options.outputPath : resolve(options.path, options.outputPath);
        options.contextPath = isAbsolute(options.contextPath) ? options.contextPath : resolve(options.path, options.contextPath);

        this.settings.merge({}, this.constructor.defaultSettings, options);

        if ( typeof options.workspace === 'string' ) {
            this.settings.workspacesEnabled   = true;
            this.settings.workspacesDirectory = options.workspace;
        }

        new.target.init(this);
    }

    public get isDev() {return this.store.get('mode') === 'development';}

    public get isProd() {return this.store.get('mode') === 'production';}

    public get isHot() {return process.argv.includes('--hot');}

    public get isServer() {return process.argv.filter(isAbsolute).filter(path => path.endsWith('webpack-dev-server') || path.endsWith('webpack-dev-server.js')).length > 0;}

    public get blocks(): Blocks {return blocks;}

    public outPath(...parts) { return resolve(this.settings.outputPath, ...parts); }

    public path(...parts) {return resolve(this.settings.path, ...parts);}

    public contextPath(...parts) {return resolve(this.settings.contextPath, ...parts);}

    public getDependencies() {return this._depends; }

    public depends(...dependencies: string[]) {
        this._depends.add(...dependencies);
        return this;
    }

    public mode(mode: Mode) {
        this._mode = mode;
        super.mode(mode);
        return this;
    }

    public inject(injector: (chain: Webpacker) => any) {
        injector(this);
        return this;
    }


    public use(plugin: (wp: Webpacker, options?: any) => any, options?: any) {plugin(this, options); }

    protected linked = [];

    public ensureLink(src: string, dest: string) {
        src  = resolve(this.settings.path, src);
        dest = resolve(this.settings.path, dest);
        if ( existsSync(dest) && this.linked.includes(dest) ) {
            return this;
        }
        existsSync(dest) && unlinkSync(dest);

        symlinkSync(src, dest, 'dir');

        this.linked.push(dest);
        this.beforeExit(() => {
            this.linked.forEach(path => {
                if ( existsSync(path) ) {
                    unlinkSync(path);
                    console.log('Cleaned ', path);
                }
            });
        });
        return this;
    }

    protected _configExtenders = [];

    public extendConfig(extender: (config: Configuration) => any) {
        this._configExtenders.push(extender);
        return this;
    }

    protected readPackageFile(): PackageJSON {
        let packageFilePath = this.path('package.json');
        if ( !existsSync(packageFilePath) ) {
            throw new Error(`Could not find your package.json file at [${packageFilePath}]`);
        }
        return require(packageFilePath);
    }

    protected getInstalledPackages(): string[] {
        let { dependencies, devDependencies } = this.readPackageFile();
        return Object.keys({ ...dependencies, ...devDependencies });
    }

    public toConfig(): Configuration {
        for ( const cb of this.beforeStartCallbacks ) {
            cb(this);
        }

        this.$emit('toConfig', this);
        let config = super.toConfig();
        if ( this._configExtenders ) {
            this._configExtenders.forEach(handler => {
                handler(config);
            });
        }
        return config;
    }


    public $on(type: string | number, listener: any) {
        this._events.on.apply(this._events, arguments);
        return this;
    }

    public $once(type: string | number, listener: any) {
        this._events.once.apply(this._events, arguments);
        return this;
    }

    public $off(type: string | number, listener: any) {
        this._events.off.apply(this._events, arguments);
        return this;
    }

    public $emit(type: string | number, ...args: any[]) {
        this._events.emit.apply(this._events, arguments);
        return this;
    }


    protected beforeStartCallbacks = [];
    protected beforeExitCallbacks  = [];

    public beforeStart(cb: Function) {
        this.beforeStartCallbacks.push(cb);
        return this;
    }

    public beforeExit(cb: Function) {
        createExitHandler(() => cb(this));
        return this;
    }


    public static definePlugin<Options = any>(defaultName: string, cb: PluginDefinitionFunction<Options>): PluginBlockFunction<Options> {
        return (wp: Webpacker, options: Options = {} as any, pluginName: string = defaultName) => {
            let plugin                          = wp.plugin(pluginName);
            let cbr: PluginDefinition<Options>  = cb(wp, plugin);
            let [ pluginClass, defaultOptions ] = cbr;
            wp.plugin(pluginName).use(pluginClass, [ merge({}, defaultOptions || {}, options) ]);
        };
    }

    public static wrap<T extends {
        (wp: Webpacker, ...params: any[]): any
        hooks?: {
            params: SyncWaterfallHook<any[]>
        }
    } = {
        (wp: Webpacker, ...params: any[]): any
        hooks?: {
            params: SyncWaterfallHook<any[]>
        }
    }>(cb: T): T & {
        hooks?: {
            params: SyncWaterfallHook<any[]>
        }
    } {
        let paramsHook = new SyncWaterfallHook<any[]>([ 'params' ]);
        let ret: any   = (wp: Webpacker, ...params: any[]) => {
            params = paramsHook.call(params);
            return cb(wp, ...params) as any;
        };
        ret.hooks      = { params: paramsHook };
        return ret;
    }

    public static defineRule<Options = any>(defaultName: string, cb: RuleDefinitionFunction<Options>): RuleDefinitionBlockFunction<Options> {
        let optionsHook                              = new SyncWaterfallHook<Options>([ 'options' ]);
        let before                                   = new SyncHook<Rule>([ 'rule' ]);
        let after                                    = new SyncHook<Rule>([ 'rule' ]);
        let fn: RuleDefinitionBlockFunction<Options> = (wp: Webpacker, options: Options = {} as any, ruleName: string = defaultName) => {
            let rule = wp.module.rule(ruleName);
            before.call(rule);
            options                          = optionsHook.call(options);
            let cbr: RuleDefinition<Options> = cb(wp, rule, options);
            if ( Array.isArray(cbr) ) {
                let [ _, defaultOptions ] = cbr;
                options                   = { ...defaultOptions, ...options };
            }
            after.call(rule);
            return rule;
        };

        fn.hooks = { options: optionsHook, before, after };

        return fn;
    }

}


