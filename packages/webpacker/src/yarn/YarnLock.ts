import { readFileSync } from 'fs';
import * as lockfile from '@yarnpkg/lockfile';
import { LockObject } from '@yarnpkg/lockfile';
import { uniq } from 'lodash';
import { findUpAll } from '../utils/findUpAll';

export interface YarnLock {
    constructor: typeof YarnLock
}

export class YarnLock {
    static findLockFiles(dirPath, fileName: string = 'yarn.lock', allowSymlink: boolean = true) {
        return findUpAll(fileName, { cwd: dirPath, type: 'file', allowSymlink })
    }

    protected lock: LockObject
    protected packageNames: string[]

    constructor(protected path: string) {
        this.update();
    }

    protected readContent() {
        return readFileSync(this.path, 'utf-8');
    }

    protected parseContent(content: string): LockObject {
        let yarnLock = lockfile.parse(content);
        if ( yarnLock.type !== 'success' ) {
            throw new Error('Yarn lock type not success');
        }
        return yarnLock.object;
    }

    update() {
        this.lock         = this.parseContent(this.readContent());
        this.packageNames = uniq(Object.keys(this.lock).map(name => {
            let segments = name.split('@');
            if ( name.includes('/') ) {
                return '@' + segments[ 1 ];
            }
            return segments[ 0 ];
        }));
    }

    getLock(): LockObject {
        return this.lock;
    }

    getPackageNames(): string[] {
        return this.packageNames;
    }
}
