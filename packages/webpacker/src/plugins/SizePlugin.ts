import { compilation, Compiler } from 'webpack';
import { resolve }               from 'path';
import { statSync }              from 'fs';

// export { SizePlugin }
export default class SizePlugin {
    apply(compiler: Compiler): void {
        const gzipSize    = require('gzip-size');
        const prettyBytes = require('pretty-bytes');
        compiler.hooks.done.tapAsync('SizePlugin', (stat, done) => {
            done();

            Array.from(stat.compilation.entrypoints.values()).forEach((entry) => {
                const chunks = entry.chunks as compilation.Chunk[];
                for ( const chunk of chunks ) {
                    chunk.files
                        .filter(file => file.endsWith('.js') || file.endsWith('.css'))
                        .map(file => ({ file, path: resolve(compiler.options.output.path, file) }))
                        .forEach(file => {
                            let min  = prettyBytes(statSync(file.path).size);
                            let gzip = prettyBytes(gzipSize.fileSync(file.path));
                            console.log(`${file.file}        ${min}    /     ${gzip}`);
                        });
                }
            });
        });
    }
}
