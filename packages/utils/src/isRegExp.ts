import kindOf from './kindOf'; 

 const isRegExp   = (value: any):value is RegExp => kindOf(value) === 'regexp'; 

export default isRegExp;
