import spawn from 'cross-spawn';
import { SpawnOptions } from 'child_process';

// cache the install check result
let yarnInstalled;

// cache npm version check result
let isNpm5;

const getPm = (...params) => 'yarn';

export interface YarnInstallOptions {
    cwd?: SpawnOptions['cwd']
    stdio?: SpawnOptions['stdio']
    env?: SpawnOptions['env']
    respectNpm5?: boolean
    deps?: string[]
    global?: boolean
    remove?: boolean
    dev?: boolean
    registry?: string
    production?: boolean
    showCommand?: boolean

}

export function yarnInstall (opts: YarnInstallOptions = {}) {
    const cwd   = opts.cwd;
    const stdio = opts.stdio === undefined ? 'inherit' : opts.stdio;

    const command = getPm();
    const deps    = (opts.deps && opts.deps.length > 0) ? opts.deps : null;

    let args;

        args = getArgs({
            // yarn global
            global        : opts.global,
            // yarn add
            add           : deps && !opts.remove,
            // yarn remove
            remove        : opts.remove,
            // yarn --dev
            '--dev'       : opts.dev,
            // yarn --production
            // only install dependencies
            '--production': opts.production,
            '--ignore-workspace-root-check':true,
            '--ignore-engines':true,
            '--ignore-platform':true,
            '--ignore-optional':true
        });


    if ( deps ) {
        args = args.concat(deps);
    }

    if ( opts.showCommand ) {
        console.log('>', command, args.join(' '));
    }

    const result = spawn.sync(command, args, {
        stdio,
        cwd,
        env: getEnv(opts, command === 'yarn'),
    });

    // set the error code
    // make sure the same behavior as in yarn and npm
    if ( result.status !== 0 ) process.exitCode = result.status;

    return result;
};

function checkYarnInstalled() {
    if ( typeof yarnInstalled !== 'undefined' ) return yarnInstalled;

    const command   = spawn.sync('yarn', [ '--version' ]);
    const installed = command.stdout && command.stdout.toString().trim();
    yarnInstalled   = installed;
    return installed;
}

function checkNpmVersion() {
    if ( typeof isNpm5 !== 'undefined' ) return isNpm5;

    const command      = spawn.sync('npm', [ '--version' ]);
    const majorVersion = parseInt(command.stdout.toString().trim().split('.')[ 0 ]);
    isNpm5             = majorVersion >= 5;
    return isNpm5;
}

function getArgs(obj) {
    return Object.keys(obj).filter(name => Boolean(obj[ name ]));
}

function getEnv(opts, isYarn) {
    const env = Object.assign({}, process.env);
    if ( opts.registry ) {
        if ( isYarn ) env.yarn_registry = opts.registry;
        else env.npm_config_registry = opts.registry;
    }
    return env;
}
