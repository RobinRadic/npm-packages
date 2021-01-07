import { resolve } from 'path';
import { IConfig } from '@oclif/config';


export class Paths {
    protected static config: IConfig;

    public static setConfig(config: IConfig) {this.config = config;}

    public static cwd(...parts) {return resolve(process.cwd(), ...parts); }

    public static linkDir(...parts) {return this.cwd(this.config.linkDir, ...parts);}

    public static php(...parts) {return this.cwd(this.config.phpPath, ...parts);}

    public static apache2(...parts) {return this.cwd(this.config.apache2Path, ...parts);}

    public static nginx(...parts) {return this.cwd(this.config.nginxPath, ...parts);}

    public static package(...parts) {return resolve(__dirname, '..', ...parts);}
}
