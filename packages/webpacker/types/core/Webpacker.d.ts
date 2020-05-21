/// <reference types="webpack-dev-server" />
/// <reference types="node" />
import Chain from 'webpack-chain';
import { Configuration } from 'webpack';
import { BabelLoaderOptions, Blocks, Mode, PluginBlockFunction, PluginDefinitionFunction, RuleDefinitionBlockFunction, RuleDefinitionFunction } from '../interfaces';
import { EventEmitter } from 'events';
import { SyncWaterfallHook } from 'tapable';
import { Dependencies } from './Dependencies';
import { Config } from './Config';
import { PackageJSON } from 'gluegun/build/types/toolbox/meta-types';
export declare type ChainWithStore<Chain, Name extends keyof Configuration> = Chain & {
    store: Map<keyof Configuration[Name], any>;
};
export interface Webpacker {
    constructor: typeof Webpacker;
}
export interface WebpackerConstructorOptions {
    mode: Mode;
    path: string;
    outputPath?: string;
    contextPath?: string;
    sourceMap?: boolean;
    workspace?: string;
}
export interface WebpackerSettings {
    [key: string]: any;
    path: string;
    outputPath: string;
    contextPath: string;
    sourceMap: boolean;
    workspacesEnabled: boolean;
    workspacesDirectory?: string;
    babel: BabelLoaderOptions;
}
export interface Mapper<ConfigKey extends keyof Configuration, Config = Configuration[ConfigKey]> extends Map<keyof Config, any> {
    get<K extends keyof Config>(key: K): Config[K];
}
export declare class Webpacker extends Chain {
    devServer: Chain.DevServer & {
        store: Mapper<'devServer'>;
    };
    module: Chain.Module & {
        store: Mapper<'module'>;
    };
    output: Chain.Output & {
        store: Mapper<'output'>;
    };
    optimization: Chain.Optimization & {
        store: Mapper<'optimization'>;
    };
    performance: Chain.Performance & {
        store: Mapper<'performance'>;
    };
    plugins: Chain.Plugins<this> & {
        store: Mapper<'plugins'>;
    };
    resolve: Chain.Resolve & {
        store: Mapper<'resolve'>;
    };
    resolveLoader: Chain.ResolveLoader & {
        store: Mapper<'resolveLoader'>;
    };
    static init: (wp: Webpacker) => void;
    static defaultSettings: Partial<WebpackerSettings>;
    static defaultOptions: Partial<WebpackerConstructorOptions>;
    readonly store: Map<keyof Configuration, any>;
    readonly settings: Config.Proxied<WebpackerSettings>;
    protected _mode: Mode;
    protected _depends: Dependencies;
    protected _events: EventEmitter;
    static precheck(): void;
    constructor(options: WebpackerConstructorOptions);
    get isDev(): boolean;
    get isProd(): boolean;
    get isHot(): boolean;
    get isServer(): boolean;
    get blocks(): Blocks;
    outPath(...parts: any[]): string;
    path(...parts: any[]): string;
    contextPath(...parts: any[]): string;
    getDependencies(): Dependencies;
    depends(...dependencies: string[]): this;
    mode(mode: Mode): this;
    inject(injector: (chain: Webpacker) => any): this;
    use(plugin: (wp: Webpacker, options?: any) => any, options?: any): void;
    protected linked: any[];
    ensureLink(src: string, dest: string): this;
    protected _configExtenders: any[];
    extendConfig(extender: (config: Configuration) => any): this;
    protected readPackageFile(): PackageJSON;
    protected getInstalledPackages(): string[];
    toConfig(): Configuration;
    $on(type: string | number, listener: any): this;
    $once(type: string | number, listener: any): this;
    $off(type: string | number, listener: any): this;
    $emit(type: string | number, ...args: any[]): this;
    protected beforeStartCallbacks: any[];
    protected beforeExitCallbacks: any[];
    beforeStart(cb: Function): this;
    beforeExit(cb: Function): this;
    static definePlugin<Options = any>(defaultName: string, cb: PluginDefinitionFunction<Options>): PluginBlockFunction<Options>;
    static wrap<T extends {
        (wp: Webpacker, ...params: any[]): any;
        hooks?: {
            params: SyncWaterfallHook<any[]>;
        };
    } = {
        (wp: Webpacker, ...params: any[]): any;
        hooks?: {
            params: SyncWaterfallHook<any[]>;
        };
    }>(cb: T): T & {
        hooks?: {
            params: SyncWaterfallHook<any[]>;
        };
    };
    static defineRule<Options = any>(defaultName: string, cb: RuleDefinitionFunction<Options>): RuleDefinitionBlockFunction<Options>;
}
