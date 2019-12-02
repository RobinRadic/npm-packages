import { loader } from 'webpack';
import { basename, dirname, extname, join, relative, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import chalk from 'chalk';

let defaults = () :SaveContentLoaderOptions=> ({
    outputPath: resolve(process.cwd(), '.tmp', 'save-content-loader'),
    verbose: false
});

export interface SaveContentLoaderOptions {
    /** @deprecated use `extension` */
    name?: string
    outputPath?: string
    verbose?:boolean
    extension?:string|((ext:string)=>string)
}

export interface LoaderContext extends loader.LoaderContext {
    query: SaveContentLoaderOptions
}

module.exports = function (content, sourceMap?) {
    let opts :SaveContentLoaderOptions= {
        ...defaults(),
        ...(this.query || {})
    }
    let relativePath = relative(this.context, join(dirname(this.resourcePath), basename(this.resourcePath)));
    // throw new Error('@todo fix problem here with invalid paths')
    let ext          = extname(relativePath);
    if(typeof opts.extension === 'function'){
        ext = opts.extension(ext)
    } else if(typeof opts.extension === 'string') {
        ext = opts.extension;
    }

    //@depracte
    if(opts.name){
        ext = opts.name
    }

    let filePath     = join(opts.outputPath, `${relativePath}.${ext}`);


    if ( !existsSync(dirname(filePath)) ) {
        mkdirSync(dirname(filePath), {
            mode     : 755,
            recursive: true,
        });
    }

    writeFileSync(filePath, content, 'utf-8');


    if(opts.verbose) {
        process.stdout.write([ chalk.bold('SaveContentLoader'), chalk.green('created'), chalk.cyan(filePath) ].join(' ') + '\n');
    }
    return content;
};


