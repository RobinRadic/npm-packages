import { Options as GithubOptions, UsersGetAuthenticatedResponse } from '@octokit/rest';
import { Options as BitbucketOptions, Schema } from 'bitbucket';
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
    github?: {
        username?: string
        token?: string
        user?: UsersGetAuthenticatedResponse
        connection?: GithubOptions
    }
    bitbucket?: {
        username?: string
        password?: string
        user?: Schema.User
        connection?: BitbucketOptions
    }
    packagist?: {
        username?: string
        token?: string
        url?: string
    },
    cache?: CacheConfig
}

export type Config = Dot<IConfig> & IConfig
