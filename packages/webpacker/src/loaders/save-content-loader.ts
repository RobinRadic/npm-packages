import { loader } from 'webpack';
import { basename, dirname, extname, join, relative, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import chalk from 'chalk';

let options = {
    outputPath: resolve(__dirname, '.tmp', 'save-content-loader'),
};

export interface SaveContentLoaderOptions {
    name: string
    outputPath?: string
}

export interface LoaderContext extends loader.LoaderContext {
    query: SaveContentLoaderOptions
}

module.exports = function (content, sourceMap?) {
    let relativePath = relative(this.context, join(dirname(this.resourcePath), basename(this.resourcePath)));
    // throw new Error('@todo fix problem here with invalid paths')
    let ext          = extname(this.resourcePath);
    let outputPath   = this.query.outputPath || options.outputPath;
    let filePath     = join(outputPath, `${relativePath}.${this.query.name}`);
    if ( !existsSync(dirname(filePath)) ) {
        mkdirSync(dirname(filePath), {
            mode     : 755,
            recursive: true,
        });
    }
    writeFileSync(filePath, content, 'utf-8');
    process.stdout.write([ chalk.bold('SaveContentLoader'), chalk.green('created'), chalk.cyan(filePath) ].join(' ') + '\n');
    return content;
};


