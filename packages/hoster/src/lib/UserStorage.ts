import { homedir }                                           from 'os';
import { resolve }                                           from 'path';
import { ensureDirSync, ensureFile }                         from 'fs-extra';
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { config }                                            from './config';


export class UserStorage {
    static get data() {return config; }

    static path(...parts) {
        return resolve(homedir(), '.hoster', ...(parts.filter(Boolean)));
    }

    static ensureDir(...parts: string[]) {
        ensureDirSync(this.path(...parts));
        return this.path(...parts);
    }

    static ensureFile(...parts: string[]) {
        ensureFile(this.path(...parts));
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
