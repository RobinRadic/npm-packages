import Chain, { Rule, Use } from 'webpack-chain';
import { Compiler, Configuration } from 'webpack';
import { BabelLoaderOptions, ConfigProxy, Mode } from './interfaces';
import { createConfig } from './utils/createConfig';
import { Deps, Yarn } from './yarn';
import { init } from './init';
import { dirname, isAbsolute, normalize, resolve } from 'path';
import { existsSync, statSync, symlinkSync, unlinkSync } from 'fs';
import { merge } from 'lodash';
import { EventEmitter } from 'events';
import { createExitHandler } from './utils/exitHandler';
import { Blocks, blocks } from './blocks';
import { SyncHook, SyncWaterfallHook } from 'tapable';


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

export interface Webpacker {
    constructor: typeof Webpacker
}

export namespace Webpacker {
    export interface Settings {
        [ key: string ]: any

        path: string
        outputPath: string
        contextPath: string
        sourceMap: boolean
        workspacesEnabled: boolean
        workspacesDirectory?: string
        installMissingDependencies?: boolean
        babel: BabelLoaderOptions
    }

    export interface Options {
        mode: Mode
        path: string
        installMissingDependencies?: boolean
        outputPath?: string
        contextPath?: string
        sourceMap?: boolean
        workspace?: string // disabled if not defined. if path defined(to workspace dir/package.json) then workspaces enabled
    }
}

export class Webpacker extends Chain {
    static defaultSettings: Partial<Webpacker.Settings> = {
        contextPath               : 'src',
        sourceMap                 : false,
        workspacesEnabled         : false,
        installMissingDependencies: true,
        babel                     : {
            babelrc       : false,
            configFile    : false,
            cacheDirectory: true,
            'sourceMaps'  : true,
            presets       : [],
            plugins       : [],
        },
    };
    public readonly store: Map<keyof Configuration, any>;
    public readonly settings: ConfigProxy<Webpacker.Settings>;

    protected _mode: Mode;
    protected _yarn: Yarn;
    protected _depends: Deps;
    protected _events: EventEmitter;

    public static precheck() {
        if ( [ 'development', 'production' ].includes(process.env.NODE_ENV) === false ) {
            throw new Error(`NODE_ENV not set to either 'development' or 'production'`);
        }
    }

    constructor(options: Webpacker.Options) {
        super();
        this.mode(options.mode);
        this.settings = createConfig(Webpacker.defaultSettings) as any;
        this._events  = new EventEmitter();

        options             = {
            ...this.constructor.defaultSettings,
            outputPath: this.isProd ? 'prod' : 'dev',
            ...options,
        };
        options.outputPath  = isAbsolute(options.outputPath) ? options.outputPath : resolve(options.path, options.outputPath);
        options.contextPath = isAbsolute(options.contextPath) ? options.contextPath : resolve(options.path, options.contextPath);

        this.settings.merge({}, this.constructor.defaultSettings, options);

        if ( typeof options.workspace === 'string' ) {
            this.settings.workspacesEnabled = true;
            let stat                        = statSync(options.workspace);
            if ( stat.isDirectory() ) {
                this.settings.workspacesDirectory = normalize(options.workspace);
            } else if ( stat.isFile() ) {
                this.settings.workspacesDirectory = normalize(dirname(options.workspace));
            } else {
                throw new Error('invalid workspace option given');
            }
            if ( !existsSync(resolve(this.settings.workspacesDirectory, 'package.json')) ) {
                throw new Error('invalid workspace option given: ' + this.settings.workspacesDirectory);
            }
        }

        let packageJsonPath = resolve(this.settings.path, 'package.json');
        if ( this.settings.workspacesEnabled ) {
            packageJsonPath = resolve(this.settings.workspacesDirectory, 'package.json');
        }

        this._yarn    = new Yarn(packageJsonPath);
        this._depends = this._yarn.createDeps();

        init(this);
    }

    public get isDev() {return this.store.get('mode') === 'development';}

    public get isProd() {return this.store.get('mode') === 'production';}

    public get isHot() {return process.argv.includes('--hot');}

    public get isServer() {return process.argv.filter(isAbsolute).filter(path => path.endsWith('webpack-dev-server') || path.endsWith('webpack-dev-server.js')).length > 0;}

    public get blocks(): Blocks {return blocks;}


    public depends(...dependencies: string[]) {
        this._depends.add(...dependencies);
        return this;
    }

    public getDepends() {
        return this._depends;
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

    public outPath(...parts) {
        return resolve(this.settings.outputPath, ...parts);
    }

    public use(plugin:(wp:Webpacker, options?:any) => any, options?:any){
        plugin(this, options)
    }

    protected linked = [];

    public ensureLink(src: string, dest: string) {
        src  = resolve(this.settings.path, src);
        dest = resolve(this.settings.path, dest);
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

    public toConfig(): Configuration {
        if ( this.settings.installMissingDependencies ) {
            let check = this._depends.getMissingPackages();
            if ( check.hasMissing ) {
                return {
                    bail  : true,
                    stats : 'none',
                    entry : resolve(__dirname, 'bin/fake-entry.js'),
                    target: (compiler: Compiler) => {
                        compiler.hooks.beforeCompile.tapAsync('WEBPACKER', (compiler, callback) => {
                            this._yarn.installMissingDependencies({
                                ...check,
                                confirm     : false,
                                afterInstall: 'restart',
                                delay       : 0,
                            });
                        });
                        return;
                    },
                };
            }
        }

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


    public static plugin<Options = any>(defaultName: string, cb: PluginDefinitionFunction<Options>): PluginBlockFunction<Options> {
        return (wp: Webpacker, options: Options = {} as any, pluginName: string = defaultName) => {
            let plugin                          = wp.plugin(pluginName);
            let cbr: PluginDefinition<Options>  = cb(wp, plugin);
            let [ pluginClass, defaultOptions ] = cbr;
            wp.plugin(pluginName).use(pluginClass, [ merge({}, defaultOptions || {}, options) ]);
        };
    }

    public static wrap<T extends {
        (wp: Webpacker, ...params: any[]):any
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

    public static rule<Options = any>(defaultName: string, cb: RuleDefinitionFunction<Options>): RuleDefinitionBlockFunction<Options> {
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


export type RuleDefinition<Options> = Use<Rule> | Rule | [ Use<Rule> | Rule, Partial<Options> ]
export type RuleDefinitionFunction<Options> = (w: Webpacker, r: Rule, o: Options) => RuleDefinition<Options>
export type RuleDefinitionBlockFunction<Options> = {
    (w: Webpacker, options?: Options, ruleName?: string): any
    hooks?: {
        options: SyncWaterfallHook<Options>
        before: SyncHook<Rule>
        after: SyncHook<Rule>
    }
}

export type PluginDefinition<Options> = [ Chain.PluginClass | string, Partial<Options>, Chain.Plugin<Webpacker> ] | [ Chain.PluginClass | string, Partial<Options> ] | [ Chain.PluginClass ]
export type PluginDefinitionFunction<Options> = (w: Webpacker, p: Chain.Plugin<Webpacker>) => PluginDefinition<Options>
export type PluginBlockFunction<Options> = (w: Webpacker, options?: Options, pluginName?: string) => any

