import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { pathExistsSync as exists } from 'fs-extra';
import { packageFile } from './interfaces';
import { find } from 'globule'

export const read  = (...path) => readFileSync(resolve.apply(resolve, path), 'utf-8')
export const write = (path, data) => writeFileSync(resolve(path), data, 'utf-8')

export type PackageProcessor<T> = (pkg: packageFile.IPackageJSON & T, path:string) => packageFile.IPackageJSON & T;
export const getRootPackage = <T>(processor?: PackageProcessor<T>): packageFile.IPackageJSON & T => {
    let packagePaths = [
        resolve(process.cwd(), 'package.json')
    ];
    for ( let path in packagePaths ) {
        if ( exists(path) ) {
            let pkg = require(path);
            return processor ? processor(pkg, path) : pkg;
        }
    }
}

export const getPackage = <T>(path: string, processor?: PackageProcessor<T>): packageFile.IPackageJSON & T => {
    if ( ! path.endsWith('package.json') ) {
        let paths = [ 'package.json', '*/package.json', '**/package.json', '**/*/package.json' ].map(glob => resolve(path, glob));
        path      = find(paths)[ 0 ];
    }
    let pkg = require(path);
    return processor ? processor(pkg, path) : pkg;
}