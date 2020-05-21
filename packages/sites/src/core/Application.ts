// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash';

import { IConfig }   from '../interfaces';
import { Config }    from './Config';
import defaultConfig from '../defaultConfig';
import { Hostfile }  from './Hostfile';
import { Nginx }     from './Nginx';
import { Php }       from './Php';
import { Apache }    from './Apache';
import { shell }     from '../utils';
import Conf          from 'conf';
import Tonto         from 'tonto';


export class Application {
    protected static _instance: Application;
    public static get instance() {
        return this._instance === undefined ? (this._instance = new Application()) : this._instance;
    }

    protected conf: Conf<IConfig>     = new Conf({ defaults: defaultConfig });
    config: Config<IConfig> & IConfig = Config.proxied<IConfig>(this.conf);
    php: Php                          = new Php(this.config.php);
    nginx: Nginx                      = new Nginx(this.config.nginx);
    apache: Apache                    = new Apache(this);
    hostfile: Hostfile                = new Hostfile(this.config.hostfile);
    logShell: boolean                 = false;

    async shell(command) {
        return shell(command, this.logShell);
    }
}

const { app } = { get app() {return Application.instance;} };

export { app };
