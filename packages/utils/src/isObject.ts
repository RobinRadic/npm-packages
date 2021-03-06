function isObject(obj: any): obj is object {
    return obj !== null && typeof obj === 'object';
}

export default isObject;
