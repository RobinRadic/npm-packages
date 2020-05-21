import { Application } from './core/Application';
import Conf            from 'conf';
import defaultConfig   from './defaultConfig';
import { IConfig }     from './interfaces';
import { Config }      from './core/Config';
import { Php }         from './core/Php';
import { Nginx }       from './core/Nginx';
import { Apache }      from './core/Apache';
import { Hostfile }    from './core/Hostfile';

// class Config<T = any> extends Conf<T> {
//     merge(value:Partial<T>){
//         this.store=merge({},this.store,value)
//     }
//     mergeAt(path:string, value:any){
//         this.set(path as any, merge(this.get(path as any),value));
//     }
//     pushTo(path: string, ...items: any[]) {
//         this.set(path as any, this.get(path as any, [] as any).concat(items))
//     }
// }

export function bootstrap() {
    const app = Application.instance;

    const conf   = new Conf<IConfig>({
        defaults: defaultConfig,
    });
    app.config   = Config.proxied<IConfig>(conf);
    app.php      = new Php(this.config.php);
    app.nginx    = new Nginx(this.config.nginx);
    app.apache   = new Apache(this.config.apache);
    app.hostfile = new Hostfile(this.config.hostfile);

    return app;
}

