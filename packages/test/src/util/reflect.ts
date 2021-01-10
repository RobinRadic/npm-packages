export const r: typeof Reflect                   = Reflect;
export const rget: typeof Reflect.getMetadata    = (...args) => r.getMetadata.call(r, ...args);
export const rset: typeof Reflect.defineMetadata = (...args) => r.defineMetadata.call(r, ...args);
export const rhas: typeof Reflect.hasMetadata    = (...args) => r.hasMetadata.call(r, ...args);
