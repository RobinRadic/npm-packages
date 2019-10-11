import { compilation, Compiler } from 'webpack';
import { resolve } from 'path';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { cloneDeep, get, set } from 'lodash';


const webpackJson = {
    filePath     : resolve(__dirname, 'app', 'webpack.json'),
    ensureRemoved: () => existsSync(webpackJson.filePath) && unlinkSync(webpackJson.filePath),
    write        : (data: object) => writeFileSync(webpackJson.filePath, JSON.stringify(data, null, 4), 'utf-8'),
}
export = JsonPlugin;

namespace JsonPlugin {
    export interface Options {
        filePath?: string
    }
}

class JsonPlugin {
    public static webpackJson: typeof webpackJson = webpackJson
    protected webpackJson: typeof webpackJson     = JsonPlugin.webpackJson

    constructor(protected options: JsonPlugin.Options = {}) {

    }

    apply(compiler: Compiler): void {
        const NAME = this.constructor.name;
        if ( this.options.filePath !== undefined ) {
            this.webpackJson.filePath = this.options.filePath
        }
        this.webpackJson.ensureRemoved();
        const createDataObject = () => {
            const obj = {
                _data: {},
                get<T>(path, def) {return get<T>(obj._data as any, path, def)},
                set(path, value) {return set(obj._data, path, value)},
                push(path, value) {return obj.set(path, obj.get<any[]>(path, []).concat(Array.isArray(value) ? value : [ value ]))},
                getData() {return cloneDeep(obj._data)},
            }
            return obj;
        }
        compiler.hooks.afterEmit.tap(NAME, compilation => {
            let stats = compilation.getStats().toJson({

            })
            const data       = createDataObject();
            const publicPath = compiler.options.output.publicPath
            Array.from(compilation.entrypoints.values()).forEach((entry) => {
                const name = entry.name;
                data.set(name, { scripts: [], styles: [] });
                const chunks = entry.chunks as compilation.Chunk[];
                for ( const chunk of chunks ) {
                    const scripts = chunk.files.filter(file => file.endsWith('.js')).map(file => publicPath + file)
                    const styles  = chunk.files.filter(file => file.endsWith('.css')).map(file => publicPath + file)
                    data.push(name + '.scripts', scripts)
                    data.push(name + '.styles', styles)
                }
            })
            this.webpackJson.ensureRemoved();
            this.webpackJson.write(data.getData());
            console.log('File written to ', this.webpackJson.filePath);
            return compilation;
        })
        compiler.hooks.emit.tap(NAME, compilation => {

        })
    }
}
