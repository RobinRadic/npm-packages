import { loader } from 'webpack';
import stripCssComments from 'strip-css-comments';
export interface StripCssCommentsLoaderOptions extends stripCssComments.Options {
}
export interface LoaderContext extends loader.LoaderContext {
    query: StripCssCommentsLoaderOptions;
}
