import kindOf from './kindOf'; 

 const isDate     = (value: any):value is Date => kindOf(value) === 'date'; 

export default isDate;
