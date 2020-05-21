import { IConfigNginx } from '../interfaces';
import { Services }     from '../Services';
import { resolve }      from 'path';

export class Nginx {
    constructor(public readonly config: IConfigNginx) {}
    get enabled(){return this.config.enabled}
    get serviceName(){return this.config.serviceName}
    async restart() {return Services.restart(this.serviceName); }
    path(...parts) { return resolve(this.config.configPath, ...parts); }
}
