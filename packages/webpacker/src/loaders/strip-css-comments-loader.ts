import { loader } from 'webpack';
import stripCssComments from 'strip-css-comments';

export interface StripCssCommentsLoaderOptions extends stripCssComments.Options {
    // preserve: boolean|RegExp|((comment:string)=>boolean)
    // whitespace:boolean
}

export interface LoaderContext extends loader.LoaderContext {
    query: StripCssCommentsLoaderOptions
}

module.exports = function (this: LoaderContext, content, sourceMap?) {
    content = stripCssComments(content, {
        preserve  : this.query.preserve,
        whitespace: this.query.whitespace,
    });
    return content;
};


