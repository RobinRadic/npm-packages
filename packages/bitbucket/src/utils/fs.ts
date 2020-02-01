import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

export const exists    = (...parts: string[]) => existsSync(join(...parts));
export const read      = (...parts: string[]) => readFileSync(join(...parts), 'utf-8')
export const write     = (data: any, ...parts: string[]) => writeFileSync(join(...parts), data, 'utf-8')
export const remove    = (...parts: string[]) => unlinkSync(join(...parts))
export const ensureDir = (path: string, force: boolean = false) => {
    if ( exists(path) ) {
        let stat = statSync(path);
        if ( ! stat.isDirectory() && force === true ) {
            unlinkSync(path);
            mkdirSync(path, { recursive: true });
        }
    } else {
        mkdirSync(path, { recursive: true });
    }
}
