import { existsSync, FSWatcher, Stats, statSync, watch, WatchEventType } from 'fs';
import { basename, dirname, isAbsolute, join, parse, ParsedPath, relative } from 'path';
import assert from 'assert';
import { readJSONSync, WatchOptions as WOptions } from 'fs-extra';
import { debounce } from 'lodash-decorators';
import debug from 'debug';
import { glob } from 'glob';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import chalk from 'chalk';
import { macro, PackageJson, TSconfigJson } from '@radic/shared';
import EventEmitter from 'events';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import { Package } from './Package';

export type DirectoryTree = Record<string, DirectoryTreeItem>;

export interface DirectoryTreeItem {
    name: string;
    path: string;
    dir: string;
    parentPath: string;

    getParent(): DirectoryTreeItem;

    stat?: FStat;
    children?: DirectoryTree;
}

export interface WatchOptions {
    directories: string[],
    watchOptions: WOptions
}

export type FStatType =
    'file'
    | 'dir'
    | 'block'
    | 'character'
    | 'link'
    | 'fifo'
    | 'socket'

export interface FStat extends Stats, ParsedPath {
    path: string;
    type: FStatType;
}
const getFstatsType           = (stats: Stats): FStatType => {
    if ( stats.isFile() ) return 'file';
    if ( stats.isDirectory() ) return 'dir';
    if ( stats.isBlockDevice() ) return 'block';
    if ( stats.isCharacterDevice() ) return 'character';
    if ( stats.isSymbolicLink() ) return 'link';
    if ( stats.isFIFO() ) return 'fifo';
    if ( stats.isSocket() ) return 'socket';
    throw new Error('Not a recognized filesystem type');
};
const toFSStats               = (path: string, stats?: Stats): FStat => {
    stats = stats || statSync(path);
    Object.assign<Stats, Partial<FStat>>(stats, { path, ...parse(path), type: getFstatsType(stats) });
    return stats as FStat;
};



export interface JsonConfigs {
    pkg: PackageJson,
    tsconfig: TSconfigJson,
    tsconfigBuild: TSconfigJson
}
const root                    = (...parts) => join(__dirname, '..', '..', ...parts);
const resolvePath             = (path: string) => isAbsolute(path) ? path : join(process.cwd(), path);
const hasNodePackage          = (path: string) => existsSync(join(path, 'package.json'));
const hasTypecriptConfig      = (path: string) => existsSync(join(path, 'tsconfig.json'));
const hasTypecriptBuildConfig = (path: string) => existsSync(join(path, 'tsconfig.build.json'));
const isRadicPackage          = (path: string) => hasNodePackage(path) && hasTypecriptConfig(path) && hasTypecriptBuildConfig(path);
const getJsonConfigs          = (path: string): JsonConfigs => {
    assert.ok(isRadicPackage(path));
    const configs: JsonConfigs = {
        pkg          : readJSONSync(join(path, 'package.json'), 'utf8'),
        tsconfig     : readJSONSync(join(path, 'tsconfig.json'), 'utf8'),
        tsconfigBuild: readJSONSync(join(path, 'tsconfig.build.json'), 'utf8'),
    };
    return configs;
};
export interface PackageBuilder extends macro.Proxy<PackageBuilder> {}

export class PackageBuilder {
    readonly hooks = {
        preWatch  : new SyncWaterfallHook<[ WatchOptions ]>([ 'watchOptions' ]),
        watch     : new SyncHook<[ string, WatchEventType, string ]>([ 'path', 'event', 'filename' ]),
        watchClose: new SyncHook<string>([ 'path' ]),
        watchError: new SyncHook<[ string, Error ]>([ 'path', 'error' ]),
        watching  : new SyncHook<[ string, FSWatcher ]>([ 'path', 'watcher' ]),
        preBuild  : new SyncWaterfallHook<[ string[] ]>([ 'commands' ]),
        postBuild : new SyncHook<[ string[] ]>([ 'commands' ]),
        build     : new SyncHook<[ string, string ]>([ 'command', 'output' ]),
        preClean  : new SyncWaterfallHook<[ string[] ]>([ 'commands' ]),
        postClean : new SyncHook<[ string[] ]>([ 'commands' ]),
        clean     : new SyncHook<[ string, string ]>([ 'command', 'output' ]),
        exec      : new SyncWaterfallHook<[ ExecSyncOptionsWithStringEncoding ]>([ 'options' ]),
    };
    protected log: (...args) => any;

    constructor(public readonly pkg: Package) {
        debug.formatters.t = v => {
            let date       = new Date(Date.now());
            let timestring = [ date.getHours(), date.getMinutes(), date.getSeconds() ].join(':');
            timestring     = chalk.bold(timestring);
            return `[${timestring}]`;
        };
        const log: any     = debug(this.pkg.name);
        this.log           = (...args) => log(...args);
        return macro.proxy(this);
    }

    watcher: FSWatcher;

    protected getDeepestUniqueDirectories() {
        let statCache: Record<string, Stats> = {};
        glob.sync(join(this.pkg.path, 'src/**'), { absolute: true, stat: true, statCache });
        const paths = Object.entries(statCache).filter(([ path, stats ]) => stats.isDirectory()).map(([ path, stats ]) => relative(this.pkg.path, path));
        return paths;
    }

    watchers: Record<string, FSWatcher> = {};

    watch() {
        this.log('%t Starting watch');
        let options: WatchOptions = {
            directories : this.getDeepestUniqueDirectories(),
            watchOptions: { encoding: 'utf-8', persistent: true },
        };
        options                   = this.hooks.preWatch.call(options);

        options.directories.forEach(path => {
            const watcher = this.watchers[ path ] = watch(join(this.pkg.path, path), options.watchOptions, (event, filename) => {
                this.log('Watched', filename, event);
                this.hooks.watch.call(path, event, filename);
                // this.clean();
                // this.build();
            });
            watcher.on('error', (error) => {
                this.log('Watch error:', error);
                this.hooks.watchError.call(path, error);
            });
            watcher.on('close', () => {
                this.log('Closing watch');
                delete this.watchers[ path ];
                this.hooks.watchClose.call(path);
            });
            this.log('Watching ', path);
            this.hooks.watching.call(path, watcher);
        });

        return this;
    }

    @debounce(400, {
        trailing: true,
        leading : false,
    })
    build() {
        this.log('%t Starting build');
        let commands = [ 'tsc --project tsconfig.build.json' ];
        commands     = this.hooks.preBuild.call(commands);
        for ( const command of commands ) {
            this.log('%t Calling', command);
            const output = this.exec(command);
            this.log('%t Called', command, 'output', output);
            this.hooks.build.call(command, output);
        }
        this.hooks.postBuild.call(commands);
        this.log('%t Build finished');
        return this;
    }

    @debounce(400, {
        trailing: true,
        leading : false,
    })
    clean() {
        this.log('%t Cleaning up');
        let commands = [ 'rm -rf lib/ types/', 'rimraf src/**/*.{js,js.map,d.ts}' ];
        commands     = this.hooks.preClean.call(commands);
        for ( const command of commands ) {
            this.log('%t Calling', command);
            const output = this.exec(command);
            this.log('%t Called', command, 'output', output);
            this.hooks.clean.call(command, output);
        }
        this.hooks.postClean.call(commands);
        this.log('Cleaned up');
        return this;

    }

    protected exec(command: string): string {
        try {
            let execOptions: ExecSyncOptionsWithStringEncoding = { cwd: this.pkg.path, encoding: 'utf-8' };
            return execSync(command, execOptions).toString();
        } catch (e) {
            console.error(`Error while executing: ${command}`, e);
        }
    }
}
