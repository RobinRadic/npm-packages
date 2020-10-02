import { resolve } from 'path';

export const cwd = (...parts: string[]) => resolve(process.cwd(), ...parts);
