import kindOf from './kindOf'; 

 const isArray    = (value: any):value is Array<any> => kindOf(value) === 'array'; 

export default isArray;
