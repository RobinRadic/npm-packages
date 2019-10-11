import { join } from 'path';
import { existsSync, statSync } from 'fs';

const getParentDirs = (str = process.cwd()) => {
    if ( str === '/' ) {
        return [ '/' ];
    }
    const parts = str.split(/[/\\]/);
    return parts.map((el, i) => parts.slice(0, parts.length - i).join('/').replace(/^$/, '/'));
};

export function findUpAll(name, options?: { cwd?: string, type?: 'file' | 'directory' | 'both', allowSymlink?: boolean }) {
    let cwd          = options.cwd || process.cwd();
    let type         = options.type || 'both';
    let allowSymlink = options.allowSymlink || true;
    return getParentDirs(cwd)
        .map(dir => join(dir, name))
        .filter(path => existsSync(path))
        .filter(path => {
            let stat = statSync(path);
            if ( !allowSymlink && stat.isSymbolicLink() ) {
                return false;
            }
            if ( (type === 'file' || type === 'both') && stat.isFile() ) {
                return true;
            }
            return (type === 'directory' || type === 'both') && stat.isDirectory();
        });

}
