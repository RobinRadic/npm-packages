import { IConfigPhpVersion, IPhpSapi } from '../interfaces';
import { Services }                    from '../Services';
import { basename, join }              from 'path';
import { existsSync, readdirSync }     from 'fs';
import { app }                         from './Application';
import { Php }                         from './Php';
import { modifyConfigFile }            from '../cli/helpers';
import { BaseCommand }                 from '../cli/BaseCommand';

export class PhpVersion {
    constructor(protected php: Php, public readonly config: IConfigPhpVersion) {}

    //@formatter:off
    public get enabled() {return this.config.enabled;}
    public get configPath() {return this.config.configPath;}
    public get binPath() {return this.config.binPath;}
    public get version() {return this.config.version;}
    public get serviceName() {return this.config.serviceName;}
    //@formatter:on

    async restart() {
        return Services.restart(this.serviceName);
    }

    isXdebugEnabled(sapi: IPhpSapi) {
        return existsSync(join(this.configPath, sapi, 'conf.d/20-xdebug.ini'));
    }

    enableXdebug(sapi: IPhpSapi | 'all') {
        app.shell(`sudo phpenmod -s ${sapi} -v ${this.version} xdebug`);
    }

    disableXdebug(sapi: IPhpSapi | 'all') {
        app.shell(`sudo phpdismod -s ${sapi} -v ${this.version} xdebug`);
    }

    availableSapis(): IPhpSapi[] {
        return readdirSync(this.configPath, 'utf-8')
            .map(path => basename(path))
            .filter(name => this.php.isPhpSapi(name));
    }

    moduleConfigFilePath(moduleName: string) {
        let moduleFileName = moduleName.endsWith('.ini') ? moduleName : `${moduleName}.ini`;
        return join(this.configPath, 'mods-available', moduleFileName);
    }

    modifyModuleConfig(cmd: BaseCommand, moduleName: string, verbose?: boolean) {
        return modifyConfigFile(cmd, this.moduleConfigFilePath(moduleName), verbose);
    }
}

