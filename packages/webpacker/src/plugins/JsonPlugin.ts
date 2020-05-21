import { compilation, Compiler, Stats }          from 'webpack';
import { resolve }                               from 'path';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { cloneDeep, get, set }                   from 'lodash';
import { SyncWaterfallHook }                     from 'tapable';


const webpackJson = {
    filePath     : resolve(__dirname, 'app', 'webpack.json'),
    ensureRemoved: () => existsSync(webpackJson.filePath) && unlinkSync(webpackJson.filePath),
    write        : (data: object) => writeFileSync(webpackJson.filePath, JSON.stringify(data, null, 4), 'utf-8'),
};

const createDataObject = (): JsonPlugin.DataObject => {
    const obj = {
        _data: {},
        get<T>(path, def?) {return get<T>(obj._data as any, path, def);},
        set(path, value) {return set(obj._data, path, value);},
        push(path, value) {return obj.set(path, obj.get<any[]>(path, []).concat(Array.isArray(value) ? value : [ value ]));},
        getData() {return cloneDeep(obj._data);},
    };
    return obj;
};
const _do              = createDataObject();

export namespace JsonPlugin {
    export interface Options {
        filePath?: string
        data?: any
        transformer?: (jsonData: any, data: typeof _do & Record<string, any>) => any
        done?: (jsonData: any, data: typeof _do & Record<string, any>, stats: Stats) => any
        remove?: boolean
    }

    export interface DataObject {
        _data: {}

        get<T>(path, def?): any

        set(path, value): any

        push(path, value): any

        getData(): any
    }
}

export class JsonPlugin {
    public static webpackJson: typeof webpackJson = webpackJson;
    protected webpackJson: typeof webpackJson     = JsonPlugin.webpackJson;
    public readonly hooks                         = {
        addToDataName : new SyncWaterfallHook<string, any>([ 'name', 'entrypoint' ]),
        addScriptsToData: new SyncWaterfallHook<string[], JsonPlugin.DataObject>([ 'scripts', 'data' ]),
        addStylesToData : new SyncWaterfallHook<string[], JsonPlugin.DataObject>([ 'scripts', 'data' ]),
    };

    constructor(protected options: JsonPlugin.Options = {}) {
        this.options.data = this.options.data || {};
    }

    apply(compiler: Compiler): void {
        const NAME = this.constructor.name;
        if ( this.options.filePath !== undefined ) {
            this.webpackJson.filePath = this.options.filePath;
        }
        if ( this.options.remove ) {
            this.webpackJson.ensureRemoved();
        }
        let jsonData: any = { ...this.options.data };
        let data          = createDataObject();

        compiler.hooks.afterEmit.tap(NAME, compilation => {
            let stats        = compilation.getStats().toJson({});
            data             = createDataObject();
            const publicPath = compiler.options.output.publicPath;
            Array.from(compilation.entrypoints.values()).forEach((entry) => {
                let name = entry.name;
                name = this.hooks.addToDataName.call(name, entry)
                data.set(name, { scripts: [], styles: [] });
                const chunks = entry.chunks as compilation.Chunk[];
                for ( const chunk of chunks ) {
                    let scripts = chunk.files.filter(file => file.endsWith('.js'));//.map(file => publicPath + file)
                    let styles  = chunk.files.filter(file => file.endsWith('.css'));//.map(file => publicPath + file)
                    scripts     = this.hooks.addScriptsToData.call(scripts, data);
                    styles      = this.hooks.addStylesToData.call(styles, data);
                    data.push(name + '.scripts', scripts);
                    data.push(name + '.styles', styles);
                }
            });
            return compilation;

        });
        compiler.hooks.done.tap(NAME, async (stats) => {
            if ( this.options.remove ) {
                this.webpackJson.ensureRemoved();
            }
            jsonData = { ...this.options.data };
            if ( typeof this.options.transformer === 'function' ) {
                jsonData = this.options.transformer(jsonData, data);
            }
            this.webpackJson.write(jsonData);
            console.log('File written to ', this.webpackJson.filePath);
            if ( typeof this.options.done === 'function' ) {
                this.options.done(jsonData, data, stats);
            }
        });
    }
}

export default JsonPlugin;
