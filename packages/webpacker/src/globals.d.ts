// noinspection ES6UnusedImports
import Config, { PluginClass } from 'webpack-chain';
import { Webpacker } from './Webpacker';
import { Configuration } from 'webpack-dev-server';
import webpack from 'webpack';

declare module 'webpack-chain' {


    interface ChainedMap<Parent> {
        depends(...dev:string[]):this
        root():Webpacker
    }

    interface TypedChainedMap<Parent,Value> {
        depends(...dev:string[]):this
        root():Webpacker
    }

    interface Plugin<Parent> {
        use(pluginClass:PluginClass|string,args?: any[]): this;
    }

    interface DevServer {
        before(value:Configuration['before'])
    }
    // interface Chained<Parent> {        depends: any    }
}

declare module 'webpack' {


    export interface ContentHash {
        [ key: string ]: string
    }

    export interface ChunkData {
        contentHashType: string
        noChunkHash: boolean
        chunk: webpack.compilation.Chunk
        contentHash?: any
        contentHashWithLength?: any
        module?: webpack.compilation.Module
    }


    export namespace compilation {
        export interface Chunk {
            filenameTemplate?: string;
            hashWithLength: string;
            contentHash?: any
            contentHashWithLength?: any
            // entryModule: MultiModule;
        }

        export interface Module {
            id: string;
            renderedHash: string;
            hash: string;
            hashWithLength: string;
            name: string;
        }
    }
    //
    // export  class MultiModule extends Module {}
    //
    // export  class Chunk extends compilation.Chunk {
    //     filenameTemplate?: string;
    //     hash: string;
    //     hashWithLength: string;
    //     groupsIterable: WeakSet<compilation.ChunkGroup> | any;
    //
    //     entryModule: MultiModule;
    // }
    //
    // export  interface ChunkTemplateHooks {
    //     hash: SyncHook
    //     hashForChunk: SyncHook
    //     modules: SyncWaterfallHook
    //     render: SyncWaterfallHook
    //     renderManifest: SyncWaterfallHook
    //     renderWithEntry: SyncWaterfallHook
    // }
    //
    // export  class ChunkTemplate extends compilation.ChunkTemplate {
    //     hooks: ChunkTemplateHooks;
    // }
    //
    // export  interface MainTemplateHooks {
    //     renderManifest: SyncWaterfallHook
    //     modules: SyncWaterfallHook
    //     moduleObj: SyncWaterfallHook
    //     requireEnsure: SyncWaterfallHook
    //     bootstrap: SyncWaterfallHook
    //     localVars: SyncWaterfallHook
    //     require: SyncWaterfallHook
    //     requireExtensions: SyncWaterfallHook
    //     beforeStartup: SyncWaterfallHook
    //     startup: SyncWaterfallHook
    //     render: SyncWaterfallHook
    //     renderWithEntry: SyncWaterfallHook
    //     moduleRequire: SyncWaterfallHook
    //     addModule: SyncWaterfallHook
    //     currentHash: SyncWaterfallHook
    //     assetPath: SyncWaterfallHook
    //     hash: SyncWaterfallHook
    //     hashForChunk: SyncWaterfallHook
    //     globalHashPaths: SyncWaterfallHook
    //     globalHash: SyncWaterfallHook
    //     hotBootstrap: SyncWaterfallHook
    //     jsonpScript: SyncWaterfallHook
    // }
    //
    // export  class ChunkGroup extends compilation.ChunkGroup {
    //     name: string;
    //
    //     getParents(): ChunkGroup[]
    // }
    //
    // export  class MainTemplate extends compilation.MainTemplate {
    //     hooks: MainTemplateHooks;
    //     outputOptions: {
    //         publicPath: string
    //         filename: string
    //         chunkFilename: string
    //     };
    // }
    //
    // export interface CompilationHooks extends compilation.CompilationHooks {
    //     compilation: SyncHook<Compilation>
    // }
    //
    //
    // export  class Compilation extends compilation.Compilation {
    //     chunkTemplate: ChunkTemplate;
    //     mainTemplate: MainTemplate;
    // }
    //
    //
    // export type OptionsItemCallback<T> = (chunk: Chunk) => T
    // export type OptionsItemTest = string | RegExp | OptionsItemCallback<boolean>
    // export type OptionsItemFilenameTemplate = string | OptionsItemCallback<string>
    //
    // export interface OptionsItem {
    //     test: OptionsItemTest
    //     filenameTemplate?: OptionsItemFilenameTemplate
    //     custom?: OptionsItemCallback<void>
    // }
    //
    // export interface Options {
    //     items?: OptionsItem[]
    // }
    //
    // export  class Module extends compilation.Module {
    //     id: string;
    //     renderedHash: string;
    //     hash: string;
    //     hashWithLength: string;
    //     name: string;
    // }
    //
    //
    // export  interface IData {
    //     chunk?: Chunk
    //     module?: Module
    //     hash: string
    //     hashWithLength: string
    //     filename: string
    //     basename: string
    //     noChunkHash?: boolean
    //     query?: string
    // }

}
