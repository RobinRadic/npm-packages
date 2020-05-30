import kindOf from './kindOf';

const isString = (value: any): value is string => kindOf(value) === 'string';

export default isString;
