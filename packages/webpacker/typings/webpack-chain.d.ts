// noinspection ES6UnusedImports
import Config, { PluginClass } from 'webpack-chain';
import { Webpacker }           from '../types/core/Webpacker';
import { Configuration }       from 'webpack-dev-server';

declare module 'webpack-chain' {


    interface ChainedMap<Parent> {
        depends(...dev: string[]): this

        root(): Webpacker
    }

    interface TypedChainedMap<Parent, Value> {
        depends(...dev: string[]): this

        root(): Webpacker
    }

    interface Plugin<Parent> {
        use(pluginClass: PluginClass | string, args?: any[]): this;
    }

    interface DevServer {
        before(value: Configuration['before'])
        after(value: Configuration['after'])
    }

    // interface Chained<Parent> {        depends: any    }
}
