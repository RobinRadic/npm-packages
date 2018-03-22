import { getPackage, getRootPackage } from './lib/utils';
import { dirname, join } from 'path';
import { packageFile } from './lib/interfaces';
import { execSync } from 'child_process';
import * as _ from 'lodash';
import { kindOf } from '@radic/util';
import { IO } from './io';


export type RootPackageFile = packageFile.IPackageJSON & { packages: Array<packageFile.IPackageJSON & { dir: string, path: string }> }
const getRootPackageFile = () => getRootPackage<RootPackageFile>((pkg, path) => {
    pkg.packages = (pkg.packages as any[]).map(packagePath => getPackage<{ dir: string, path: string }>(packagePath, pkg => {
        pkg.dir  = dirname(packagePath);
        pkg.path = packagePath
        return pkg
    }));
    return pkg;
});

export interface ILernaListItem {
    name: string
    version: string
    private: false
}

export interface ILernaGlobalOptions {
    loglevel?: string
    /** How many threads to use if lerna parallelises the tasks.                                                                                                                                                                                                                                                                                    [number] */
    concurrency?: any
    /** Restricts the scope to package names matching the given glob. (Only for 'run', 'exec', 'clean', 'ls', and 'bootstrap' commands)                                                                                                                                                                                                                                                                           [string] */
    scope?: any
    /** Restricts the scope to the packages that have been updated since    the specified [ref], or if not specified, the latest tag.    (Only for 'run', 'exec', 'clean', 'ls', and 'bootstrap' commands)                                                                                                                                                                                                                                                                           [string] */
    since?: any
    /** Ignore packages with names matching the given glob.    (Only for 'run', 'exec', 'clean', 'ls', and 'bootstrap' commands)                                                                                                                                                                                                                                                                           [string] */
    ignore?: any
    /** Include all transitive dependencies when running a command, regardless of --scope, --since or --ignore. */
    includeFilteredDependencies?: any
    /** Use the specified registry for all npm client operations.                                                                                                                                                                                                                                                                                   [string] */
    registry?: any
    /** Fail if a cycle is detected among dependencies                                                                                                                                                                                                                                                                            [boolean] [default: false] */
    rejectCycles?: any
    /** Sort packages topologically (all dependencies before dependents)                                                                                                                                                                                                                                                                           [boolean] */
    sort?: any
    /** Set max-buffer(bytes) for Command execution */
    maxBuffer?: any
}

IO

export class LernaIO {

}

export class Lerna {
    bin                                = join('node_modules', '.bin', 'lerna');
    globalOptions: ILernaGlobalOptions = {}

    protected transformOptions(options: object) {
        return Object.keys(options).map(key => {
            let value = options[ key ];
            let arg   = '--' + _.snakeCase(key);
            if ( value === undefined ) {
                return ''
            }
            if ( typeof value === 'boolean' ) {
                return arg;
            }
            return arg + ' ' + value
        }).join(' ')
    }

    exec(args: string[] | string, options: object = {}): string {
        let arg: string = args as string;
        if ( kindOf(args) == 'array' ) {
            let arg = args.length === 1 ? args[ 0 ] : (args as string[]).join(' ')
        }
        if ( Object.keys(options).length > 0 ) {
            arg += this.transformOptions(options)
        }

        if ( Object.keys(this.globalOptions).length > 0 ) {
            arg += this.transformOptions(this.globalOptions)
        }

        return execSync(this.bin + ' ' + arg, {
            cwd  : process.cwd(),
            stdio: 'pipe'
        }).toString();
    }

    protected _list: ILernaListItem[]
    get list(): ILernaListItem[] {
        if ( ! this._list ) {
            this._list = JSON.parse(this.exec('ls --json --loglevel error'));
        }
        return this._list;
    }

    protected _package: RootPackageFile;
    get package(): RootPackageFile {
        if ( ! this._package ) {
            this._package = getRootPackageFile()
        }
        return this._package;
    }

    interactive(): Promise<any> {
        return Promise.resolve();
    }

}

export const lerna: Lerna = new Lerna()