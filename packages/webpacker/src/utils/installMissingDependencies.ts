import { Log } from '../Log';
import inquirer from 'inquirer';
import { yarnInstall } from '../yarn/yarnInstall';
import { restart } from './restart';


let defaults: InstallMissingDependenciesOptions = {
    dependencies   : [],
    devDependencies: [],
    quiet          : false,
    confirm        : false,
    afterInstall   : 'exit',
    delay          : 0,
    exitOnNo       : true,
};

export interface InstallMissingDependenciesOptions {
    dependencies?: string[],
    devDependencies?: string[],
    quiet?: boolean,
    confirm?: boolean,
    afterInstall?: 'restart' | 'exit' | 'continue' | Function
    delay?: number,
    exitOnNo?: boolean,
}

export function installMissingDependencies(options: InstallMissingDependenciesOptions) {
    options = {...defaults, ...options}
    Log.debug('installMissingDependencies', options)
    const install = () => {
        if ( options.dependencies.length > 0 ) {
            Log.debug(yarnInstall({
                deps: options.dependencies,
            }));
        }
        if ( options.devDependencies.length > 0 ) {
            Log.debug(yarnInstall({
                deps: options.devDependencies,
                dev : true,
            }));
        }
        if ( !options.quiet ) {
            Log.line('Dependencies installed. Restarting...', 'success');
        }

        if ( options.afterInstall === 'restart' ) {
            restart();
        } else if(options.afterInstall === 'exit'){
            process.exit()
        } else if(typeof options.afterInstall === 'function'){
            options.afterInstall();
        }
    };
    const confirm = (callback) => {
        inquirer.prompt({
            name   : 'install',
            message: 'Install packages?',
            default: true,
        }).then(answer => {
            callback(answer.install);
        });
    };
    setTimeout(() => {
        if ( !options.quiet ) {

            if ( options.dependencies.length > 0 ) {
                Log.line('Missing dependencies: ' + options.dependencies.map(name => Log.styles.info(name)).join(', '));
            }
            if ( options.devDependencies.length > 0 ) {
                Log.line('Missing devDependencies: ' + options.devDependencies.map(name => Log.styles.info(name)).join(', '));
            }
        }
        if ( options.confirm ) {
            confirm(answer => {
                Log.debug({answer})
                if ( answer === false && options.exitOnNo ) {
                    process.exit(0);
                }
                if ( answer ) {
                    Log.debug('install')
                    install();
                }
            });
        } else {
            install();
        }
    }, options.delay);
}
