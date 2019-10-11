import { Compiler } from 'webpack';
import { Tapable } from 'tapable';
import { installMissingDependencies, InstallMissingDependenciesOptions } from '../utils/installMissingDependencies';


const NAME = 'MissingWebpackerDependencies';

export namespace MissingWebpackerDependencies {
    export interface Options extends InstallMissingDependenciesOptions {}
}

export class MissingWebpackerDependencies implements Tapable.Plugin {
    protected options: MissingWebpackerDependencies.Options;

    constructor(options: MissingWebpackerDependencies.Options = {}) {
        this.options = {
            dependencies   : [],
            devDependencies: [],
            delay          : 2000,
            afterInstall   : 'exit',
            quiet          : false,
            confirm        : true,
            ...options,
        };
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(NAME, (compiler, callback) => {
            installMissingDependencies(this.options);
        });
    }
}
