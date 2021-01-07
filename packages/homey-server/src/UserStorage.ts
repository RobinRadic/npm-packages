import { homedir }                                                       from 'os';
import { resolve }                                                       from 'path';
import { ensureDirSync, ensureFile }                                     from 'fs-extra';
import { existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { conf }                                                          from './conf';


export class UserStorage {
    static dirName: string = require('../package.json').name.replace('/', '_');

    static get data() {return conf; }

    static path(...parts) {
        return resolve(homedir(), '.' + this.dirName, ...(parts.filter(Boolean)));
    }

    static ensureDir(...parts: string[]) {
        ensureDirSync(this.path(...parts));
        return this.path(...parts);
    }

    static ensureFile(...parts: string[]) {
        ensureFile(this.path(...parts));
        return this.path(...parts);
    }

    static removeFileIfExists(...parts: string[]) {
        if ( this.exists(...parts) ) {
            unlinkSync(this.path(...parts));
        }
        return this.path(...parts);
    }

    static exists(...parts: string[]) {
        return existsSync(this.path(...parts));
    }

    static isFile(...parts: string[]) {
        return statSync(this.path(...parts)).isFile();
    }

    static isDirectory(...parts: string[]) {
        return statSync(this.path(...parts)).isDirectory();
    }

    static isSymbolicLink(...parts: string[]) {
        return statSync(this.path(...parts)).isSymbolicLink();
    }

    static read(path: string) {
        return readFileSync(this.path(path), 'utf8');
    }

    static write(path: string, content: string) {
        writeFileSync(this.path(path), content, 'utf8');
        return this;
    }
}
