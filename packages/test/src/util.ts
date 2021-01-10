import { get, has, merge, set, unset } from 'lodash';
import 'reflect-metadata';
import { inspect }                     from 'util';

export const r    = Reflect;
export const rget = Reflect.getMetadata;
export const rset = Reflect.defineMetadata;
export const rhas = Reflect.hasMetadata;

export const check = (value) => {
    let result = inspect(value, {
        showHidden    : true,
        colors        : true,
        compact       : false,
        maxArrayLength: Infinity,
        showProxy     : true,
        depth         : Infinity,
    });
    process.stdout.write(result, 'utf8', err => {
        console.error('error occurred for check:', err);
    });
};
