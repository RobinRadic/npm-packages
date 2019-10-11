import { yarnInstall, YarnInstallOptions } from './yarnInstall';
import { installMissingDependencies, InstallMissingDependenciesOptions } from '../utils/installMissingDependencies';
import { dirname } from 'path';
import { YarnLock } from './YarnLock';
import { Deps } from './Deps';


export class Yarn {
    protected packagePath: string
    public readonly lock: YarnLock

    constructor(protected packageJsonPath: string) {
        this.packagePath = dirname(packageJsonPath)
        this.lock        = new YarnLock(
            YarnLock.findLockFiles(this.packagePath).shift(),
        )
    }

    install(options: YarnInstallOptions) {
        return yarnInstall(options)
    }

    installMissingDependencies(options: InstallMissingDependenciesOptions) {
        return installMissingDependencies(options)
    }

    createDeps():Deps{
        const registry = new Deps(this);
        return registry;
    }

    public add(...names: string[]) {

    }

}
