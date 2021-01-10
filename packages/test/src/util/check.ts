import { inspect } from 'util';

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
