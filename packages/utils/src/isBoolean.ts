import kindOf from './kindOf'; 

 const isBoolean  = (value: any):value is boolean => kindOf(value) === 'boolean'; 

export default isBoolean;
