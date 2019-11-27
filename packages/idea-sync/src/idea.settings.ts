import { ISettingConfig } from './interfaces';


export class SettingConfigs {
    static items: Record<string, ISettingConfig>;

    static add(config: ISettingConfig) {
        this.items[ config.name ] = config;
        return this;
    }

    static set(name: string, config: Omit<ISettingConfig, 'name'>) {return this.add({ ...config, name });}

    static get(name: string): ISettingConfig {return this.items[ name ]; }

    static has(name: string) {return name in this.items; }

    static all() {return this.items;}
}
