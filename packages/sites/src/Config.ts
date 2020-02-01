import { merge } from 'lodash';

export class Config {
    partials: PartialConfig[];
    items: any = {};

    // addPartial(partial: PartialConfig) {
    //     this.partials.push(partial.items);
    //     new Proxy(this, {
    //         get(target: Config, p: string | number | symbol, receiver: any): any {
    //             target.partials;
    //         },
    //         set(target: Config, p: string | number | symbol, value: any, receiver: any): boolean {
    //
    //         },
    //     });
    //     merge(this.items, partial.items);
    // }
}

export class PartialConfig {
    id: string;
    priority: number;
    type: 'file' | 'memory';
    filePath: string;
    items: any = {};
}

export class Manager {
    loadFrom(path) {}

    loadFromGlobal() {}

    loadFromCwd() {}
}

export class ConfigItem<V = any> {
    public key;
    public value: V;
    public modified = false;
    public originalValue: V;
}

let defaults = {
    paths: {
        nginx: '/etc/nginx',
        php  : {
            root   : '/etc/php',
            version: '{paths.php.version}/%s',
            sapi   : '',
        },
        hosts: '/etc/hosts',
    },
};
let cfg      = {
    paths: {},
};


/*

Manager loads config file(s) as PartialConfig
PartialConfig
    - id
    - path
    - priority?
    - items

ConfigItem
    - key
    - value

 */
