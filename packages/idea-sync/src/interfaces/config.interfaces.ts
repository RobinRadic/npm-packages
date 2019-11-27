import { StoreConfig } from 'cache-manager';
import { Dot } from '../utils/Dot';


export interface FsStoreConfig {
    path?: string
    maxsize?: any
    zip?: boolean
}

export interface CacheConfig extends Partial<StoreConfig>, FsStoreConfig {

}

export interface IConfig {
    cache?: CacheConfig
}

export type Config = Dot<IConfig> & IConfig
