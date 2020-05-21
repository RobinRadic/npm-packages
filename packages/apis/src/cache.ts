import { caching }  from 'cache-manager';
import cacheFsStore from 'cache-manager-fs';

export const cache = caching({
    store  : cacheFsStore,
    ttl    : 60 * 60,
    max    : 1000 * 1000,
    maxsize: 1000 * 1000,
} as any);
