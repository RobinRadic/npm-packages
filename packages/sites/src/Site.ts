import { basename, extname, resolve }          from 'path';
import { existsSync, symlinkSync, unlinkSync } from "fs";
import { strHas }                              from './utils';

export class Site {
    public readonly name: string;
    public readonly prettyName: string;
    public readonly enabledPath: string;
    public enabled: boolean;

    constructor(public readonly path) {
        this.name        = basename(path);
        this.prettyName  = basename(path, extname(path));
        this.enabledPath = resolve('/etc/nginx/sites-enabled', this.name);
        this.enabled     = existsSync(this.enabledPath);
    }

    public enable() {
        if ( !existsSync(this.enabledPath) ) {
            symlinkSync(this.path, this.enabledPath);
        }
        this.enabled = true;
        return this;
    }

    public disable() {
        if ( existsSync(this.enabledPath) ) {
            unlinkSync(this.enabledPath);
        }
        this.enabled = false;
        return this;
    }

    is(nameSegment: string) {return strHas(nameSegment).test(this.name); }
}
