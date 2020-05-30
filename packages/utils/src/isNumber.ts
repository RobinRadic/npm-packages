import kindOf from './kindOf'; 

 const isNumber   = (value: any):value is number => kindOf(value) === 'number'; 

export default isNumber;
