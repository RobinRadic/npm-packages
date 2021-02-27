class SiteRepository {
    static find() {

    }
}

class Site {
    engines: Engine;

}


export namespace Version {

}
import { parse, SemVer } from 'semver';
import { Collection }    from 'collect.js';

export class PHP {
    version: string;
    type: PHP.Type;

    get isCLI() {return PHP.isCLI(this.type);}

    get isGCI() {return PHP.isGCI(this.type);}

    get isFPM() {return PHP.isFPM(this.type);}

    get semversion(): SemVer {return parse(this.version);}
}

export namespace PHP {
    export const isCLI = (type: Type) => type === Type.CLI;
    export const isGCI = (type: Type) => type === Type.GCI;
    export const isFPM = (type: Type) => type === Type.FPM;

    export enum Type {
        'CLI',
        'GCI',
        'FPM',
    }

}

class PhpVersion {

}

export type Path = string | string[]

class Paths extends Collection<string> {
    public static isMultiPath(val: any): val is string[] {return Array.isArray(val);}
}

class EngineRespository extends Collection<Engine> {}

class App {
    private static _instance: App;
    public static get instance() {
        if ( !App._instance ) {
            App._instance = new App;
        }
        return App._instance;
    }

    protected constructor() {}

    public engines = new EngineRespository();
    public paths   = new Paths();

}

const app = App.instance;


abstract class Engine {
    abstract name: string;
    php: PhpVersion;
}

class NginxEngine extends Engine {
    name = 'nginx';
}

class ApacheEngine extends Engine {
    name = 'nginx';
}
