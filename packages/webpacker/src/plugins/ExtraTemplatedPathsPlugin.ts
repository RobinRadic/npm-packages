///<reference path="../globals.d.ts"/>

import { ChunkData, compilation } from 'webpack';
import { SyncBailHook, SyncHook, SyncWaterfallHook, Tapable } from 'tapable';
import _ from 'lodash';
//
// const REGEXP_HASH        = /\[hash(?::(\d+))?\]/gi,
//       REGEXP_CHUNKHASH   = /\[chunkhash(?::(\d+))?\]/gi,
//       REGEXP_MODULEHASH  = /\[modulehash(?::(\d+))?\]/gi,
//       REGEXP_CONTENTHASH = /\[contenthash(?::(\d+))?\]/gi,
//       REGEXP_NAME        = /\[name\]/gi,
//       REGEXP_ID          = /\[id\]/gi,
//       REGEXP_MODULEID    = /\[moduleid\]/gi,
//       REGEXP_FILE        = /\[file\]/gi,
//       REGEXP_QUERY       = /\[query\]/gi,
//       REGEXP_FILEBASE    = /\[filebase\]/gi,
//       REGEXP_URL         = /\[url\]/gi;
//
// // Using global RegExp for .test is dangerous
// // We use a normal RegExp instead of .test
// const REGEXP_HASH_FOR_TEST        = new RegExp(REGEXP_HASH.source, 'i'),
//       REGEXP_CHUNKHASH_FOR_TEST   = new RegExp(REGEXP_CHUNKHASH.source, 'i'),
//       REGEXP_CONTENTHASH_FOR_TEST = new RegExp(REGEXP_CONTENTHASH.source, 'i'),
//       REGEXP_NAME_FOR_TEST        = new RegExp(REGEXP_NAME.source, 'i');
//
// const withHashLength = (replacer, handlerFn, assetInfo) => {
//     const fn = (match, hashLength, ...args) => {
//         if ( assetInfo ) assetInfo.immutable = true;
//         const length = hashLength && parseInt(hashLength, 10);
//         if ( length && handlerFn ) {
//             return handlerFn(length);
//         }
//         const hash = replacer(match, hashLength, ...args);
//         return length ? hash.slice(0, length) : hash;
//     };
//     return fn;
// };
//
// const getReplacer = (value, allowEmpty) => {
//     const fn = (match, ...args) => {
//         // last argument in replacer is the entire input string
//         const input = args[ args.length - 1 ];
//         if ( value === null || value === undefined ) {
//             if ( ! allowEmpty ) {
//                 throw new Error(
//                     `Path variable ${match} not implemented in this context: ${input}`,
//                 );
//             }
//             return '';
//         } else {
//             return `${escapePathVariables(value)}`;
//         }
//     };
//     return fn;
// };
//
// const escapePathVariables = value => {
//     return typeof value === 'string'
//            ? value.replace(/\[(\\*[\w:]+\\*)\]/gi, '[\\$1\\]')
//            : value;
// };


//
// export type TemplatedPathValueFn = (context: ReplacerContext, p:ResolvedTemplatedPath) => string
// export type TemplatedPathValue = string |TemplatedPathValueFn
// export interface TemplatedPath {
//     key: string // ex: 'dirname'. will be '[dirname]'
//     value: TemplatedPathValue
// }
// export interface ResolvedTemplatedPath extends TemplatedPath {
//     resolver:TemplatedPathResolver
// }

const NAME = 'ExtraTemplatedPathsPlugin'

export interface ReplacerContext {
    compilation: Compilation
    path: string
    module?: compilation.Module
    chunk: compilation.Chunk
    chunkData: ChunkData
    chunkId?: string
    chunkName?: string
    chunkHash?: string
    chunkHashWithLength?: string
    contentHashType?: string
    contentHash?: string
    contentHashWithLength?: string
    moduleId?: string
    moduleHash?: string
    moduleHashWithLength?: string

}

export type ReplacerStringValue = string
export type ReplacerCallbackValue = (context: ReplacerContext, parsed: Parsed) => string | false
export type ReplacerValue = ReplacerStringValue | ReplacerCallbackValue

export type ReplacerKey = string
export type Replacers = ReplacerValue | Record<ReplacerKey, ReplacerValue>
export type ReplacerDict = Record<ReplacerKey, ReplacerCallbackValue>

export interface ExtraTemplatedPathsPluginOptions {
    templates: Record<string, ReplacerCallbackValue>
}

class Parsed {
    public template?: string
    public arg?: string
    public fallback?: string
    public fallbackType?: 'templated' | 'string'

    get ignore() {return this.template === undefined}

    get hasArg() {return this.arg !== undefined}

    get hasFallback() {return this.fallback !== undefined}

    constructor(public string: string) {}
}

class TemplatedPathParser {
    matchers = {
        arg     : /^:[\w\d_-]+/gi,
        fallback: /^\|.+/gi
    }

    constructor(protected key: string, protected replacer?:ReplacerCallbackValue) {}

    exp() {return new RegExp('\\[' + this.key + '(.*?)?\]', 'gi'); }

    parse(string: string):Parsed[] {
        let results = []
        if ( !this.matches(string) ) {
            return results;
        }
        // let [ template, rest, ...other ] = this.exp().exec(string);
        let matches;
        let exp=this.exp()
        while ( (matches = exp.exec(string)) !== null ) {
            let [ template, rest ] = matches
            const parsed           = new Parsed(string)
            parsed.template        = template
            if ( rest ) {
                let count = 0;
                while ( rest.length || count > 10 ) {
                    if ( rest.match(this.matchers.arg) ) {
                        let matches = rest.match(this.matchers.arg)
                        rest        = rest.slice(matches[ 0 ].length)
                        parsed.arg  = matches[ 0 ].slice(1)
                    } else if ( rest.match(this.matchers.fallback) ) {
                        let matches         = rest.match(this.matchers.fallback)
                        rest                = rest.slice(matches[ 0 ].length)
                        parsed.fallback     = matches[ 0 ].slice(1)
                        parsed.fallbackType = parsed.fallback.startsWith('"') || parsed.fallback.startsWith('\'') ? 'string' : 'templated'
                    }
                    count ++;
                }
            }

            results.push(parsed)
        }
        return results;
        // parsed.template        = template
        // let o = other
        // if ( rest ) {
        //     let count=0;
        //     while ( rest.length || count > 10) {
        //         if ( rest.match(this.matchers.arg) ) {
        //             let matches = rest.match(this.matchers.arg)
        //             rest        = rest.slice(matches[ 0 ].length)
        //             parsed.arg  = matches[ 0 ].slice(1)
        //         } else if ( rest.match(this.matchers.fallback) ) {
        //             let matches     = rest.match(this.matchers.fallback)
        //             rest            = rest.slice(matches[ 0 ].length)
        //             parsed.fallback = matches[ 0 ].slice(1)
        //             parsed.fallbackType = parsed.fallback.startsWith('"') || parsed.fallback.startsWith("'") ? 'string' : 'templated'
        //         }
        //         count ++;
        //     }
        // }
        // return parsed;
    }

    matches(string: string) {return string.match(this.exp())}
}

// new ExtraTemplatedPathsPlugin({
//     templates: {
//         addon: {
//             path: ''
//         },
//         mya: 'asdf',
//         asdf: (context, parsed) => {
//             return ''
//         }
//     }
// })


export namespace ExtraTemplatedPathsPlugin {
    export interface Options extends ExtraTemplatedPathsPluginOptions {

    }
}

export class ExtraTemplatedPathsPlugin {
    templates: Array<{ parser: TemplatedPathParser, key: string, replace: ReplacerCallbackValue }> = []

    constructor(options: ExtraTemplatedPathsPluginOptions) {
        Object.keys(options.templates).forEach(key => {

            this.templates.push({ key, replace: options.templates[ key ], parser: new TemplatedPathParser(key, options.templates[ key ]) })
        })
    }

    apply(compiler: Compiler) {
        compiler.hooks.compilation.tap(NAME, compilation => {
            const mainTemplate = compilation.mainTemplate;

            let data = {}

            const push = (path: string, value) => {
                let parent = _.get(data, path, [])
                parent.push(value)
                _.set(data, path, parent)
            }

            mainTemplate.hooks.assetPath.tap({ name: NAME, stage: 2 } as any, (path, data: ChunkData, assetInfo) => {
            // mainTemplate.hooks.assetPath.tap(NAME, (path, data: ChunkData, assetInfo) => {
                const chunk                 = data.chunk;
                const chunkId               = chunk && chunk.id;
                const chunkName             = chunk && (chunk.name || chunk.id);
                const chunkHash             = chunk && (chunk.renderedHash || chunk.hash);
                const chunkHashWithLength   = chunk && chunk.hashWithLength;
                const contentHashType       = data.contentHashType;
                const contentHash           =
                          (chunk && chunk.contentHash && chunk.contentHash[ contentHashType ]) ||
                          data.contentHash;
                const contentHashWithLength =
                          (chunk &&
                              chunk.contentHashWithLength &&
                              chunk.contentHashWithLength[ contentHashType ]) ||
                          data.contentHashWithLength;
                const module                = data.module;
                const moduleId              = module && module.id;
                const moduleHash            = module && (module.renderedHash || module.hash);
                const moduleHashWithLength  = module && module.hashWithLength;

                let context: ReplacerContext = {
                    compilation,
                    path,
                    chunk,
                    chunkData: data,
                    chunkId, chunkName, chunkHash, chunkHashWithLength, contentHashType,
                    contentHash, contentHashWithLength,
                    module, moduleId, moduleHash, moduleHashWithLength
                }
                for ( let tpl of this.templates ) {
                    if ( !tpl.parser.matches(path) ) continue;
                    let parsed = tpl.parser.parse(path)
                    parsed.forEach(p => {
                        let result = tpl.replace(context, p)
                        if(result === false && p.hasFallback){
                            result = p.fallbackType === 'templated' ? `[${p.fallback}]` : p.fallback.replace(/^"|'/,'').replace(/"|'$/,'')
                        }
                        if(result !== false) {
                            path = path.replace(p.template, result)
                        }
                    })
                }
                // this.templates.filter(template => {
                //     return template.parser.matches(path)
                // }).forEach(template => {
                //     let parsed = template.parser.parse(path)
                //     let replacer:ReplacerCallbackValue = template.replace as any
                //     if(typeof replacer === 'string'){
                //         replacer = (c,p) => template.replace.toString()
                //     }
                //     let result = replacer.apply(this, [context, parsed]);
                //     if(result === false && parsed.hasFallback){
                //         result = parsed.fallbackType === 'templated' ? `[${parsed.fallback}]` : parsed.fallback.replace(/^"|'/,'').replace(/"|'$/,'')
                //     }
                //     while(path.includes(parsed.template)) {
                //         path = path.replace(parsed.template, result)
                //     }
                // })
                return path
            });

            // this.paths.filter(p => p.test(path)).forEach(p => {
            //     let value = p.value
            //     if ( typeof value === 'function' ) {
            //         value = value.apply(this, [ context, p ])
            //     }
            //     path = path.replace(p.exp(), value)
            // })
            // let d = { path, chunkId, chunkName, chunkHash, chunkHashWithLength, contentHashType, contentHash, contentHashWithLength, chunk }
            // if ( chunkId && chunkHash ) {
            //     push('ids', d)
            //     push(`id.${chunkId}`, d)
            //     push(`name`, d)
            //     push(`names.${chunkName}`, d)
            //     push(`hashes`, d)
            //     push(`hash.${chunkHash}`, d)
            //     push(`contentHashes`, d)
            //     push(`contentHash.${contentHash}`, d)
            // }
            // if(chunk.hasEntryModule()){
            //     let addon = this.addons.find(a => a.lastNameSnake === chunk.entryModule.name);
            //     path=path.replace(/\[addon\]/gi, addon.name);
            // }
            // let addon = this.addons.find(a => a.lastNameSnake === chunkName);
            // if ( addon ) {
            //     path = path.replace(/\[addon\]/gi, addon.name);
            // }

        });
    }
}


export declare class MultiModule extends Module {}

export declare class Chunk extends compilation.Chunk {
    filenameTemplate?: string;
    hash: string;
    hashWithLength: string;
    groupsIterable: WeakSet<compilation.ChunkGroup> | any;

    entryModule: MultiModule;
}

export declare interface ChunkTemplateHooks {
    hash: SyncHook
    hashForChunk: SyncHook
    modules: SyncWaterfallHook
    render: SyncWaterfallHook
    renderManifest: SyncWaterfallHook
    renderWithEntry: SyncWaterfallHook
}

export declare class ChunkTemplate extends compilation.ChunkTemplate {
    hooks: ChunkTemplateHooks;
}

export declare interface MainTemplateHooks {
    renderManifest: SyncWaterfallHook
    modules: SyncWaterfallHook
    moduleObj: SyncWaterfallHook
    requireEnsure: SyncWaterfallHook
    bootstrap: SyncWaterfallHook
    localVars: SyncWaterfallHook
    require: SyncWaterfallHook
    requireExtensions: SyncWaterfallHook
    beforeStartup: SyncWaterfallHook
    startup: SyncWaterfallHook
    render: SyncWaterfallHook
    renderWithEntry: SyncWaterfallHook
    moduleRequire: SyncWaterfallHook
    addModule: SyncWaterfallHook
    currentHash: SyncWaterfallHook
    assetPath: SyncWaterfallHook
    hash: SyncWaterfallHook
    hashForChunk: SyncHook
    globalHashPaths: SyncWaterfallHook
    globalHash: SyncBailHook
    hotBootstrap: SyncWaterfallHook
    jsonpScript: SyncWaterfallHook
}

export declare class ChunkGroup extends compilation.ChunkGroup {
    name: string;

    getParents(): ChunkGroup[]
}

export declare class MainTemplate extends compilation.MainTemplate {
    hooks: MainTemplateHooks;
    outputOptions: {
        publicPath: string
        filename: string
        chunkFilename: string
    };
}

export interface CompilationHooks extends compilation.CompilationHooks {
    compilation: SyncHook<Compilation>
}


export declare class Compiler extends Tapable {
    hooks?: CompilationHooks
}

export declare class Compilation extends compilation.Compilation {
    chunkTemplate: ChunkTemplate;
    mainTemplate: MainTemplate;
}


export type OptionsItemCallback<T> = (chunk: Chunk) => T
export type OptionsItemTest = string | RegExp | OptionsItemCallback<boolean>
export type OptionsItemFilenameTemplate = string | OptionsItemCallback<string>

export interface OptionsItem {
    test: OptionsItemTest
    filenameTemplate?: OptionsItemFilenameTemplate
    custom?: OptionsItemCallback<void>
}

export interface Options {
    items?: OptionsItem[]
}

export declare class Module extends compilation.Module {
    id: string;
    renderedHash: string;
    hash: string;
    hashWithLength: string;
    name: string;
}


export declare interface IData {
    chunk?: Chunk
    module?: Module
    hash: string
    hashWithLength: string
    filename: string
    basename: string
    noChunkHash?: boolean
    query?: string
}
