import kindOf from './kindOf'; 

 const isError    = (value: any):value is Error => kindOf(value) === 'error'; 

export default isError;
