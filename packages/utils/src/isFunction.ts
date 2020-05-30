import kindOf from './kindOf'; 

 const isFunction = (value: any):value is Function => kindOf(value) === 'function'; 

export default isFunction;
