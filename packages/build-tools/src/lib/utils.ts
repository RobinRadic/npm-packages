import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export const read  = (...path) => readFileSync(resolve.apply(resolve, path), 'utf-8')
export const write = (path, data) => writeFileSync(resolve(path), data, 'utf-8')