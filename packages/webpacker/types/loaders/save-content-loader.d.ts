import { loader } from 'webpack';
export interface SaveContentLoaderOptions {
    /** @deprecated use `extension` */
    name?: string;
    outputPath?: string;
    verbose?: boolean;
    extension?: string | ((ext: string) => string);
}
export interface LoaderContext extends loader.LoaderContext {
    query: SaveContentLoaderOptions;
}
