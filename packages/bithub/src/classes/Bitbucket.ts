import BaseBitbucket, { Options } from 'bitbucket';
import { decorate, injectable } from 'inversify';
import { inject } from '../app';
import hash,{} from 'object-hash'
import { Cache } from '../interfaces';
export interface RequestOptions extends Options {

    accepts?: any
    body?: any
    method?: string
    url?: string
}
decorate(injectable(), BaseBitbucket);

// See https://github.com/octokit/request.js#octokitrequest
export type HookOptions = {
    baseUrl: string;
    headers: { [header: string]: string };
    method: string;
    url: string;
    data: any;
    // See https://github.com/bitinn/node-fetch#options
    request: {
        follow?: number;
        timeout?: number;
        compress?: boolean;
        size?: number;
        agent?: string | null;
    };
    [index: string]: any;
};

export type HookError = Error & {
    status: number;
    headers: { [header: string]: string };
    documentation_url?: string;
    errors?: [
        {
            resource: string;
            field: string;
            code: string;
        }
    ];
};

export interface Bitbucket {

    hook: {
        before(
            name: string,
            callback: (options: HookOptions) => void
        ): void;
        after(
            name: string,
            callback: (
                response: BaseBitbucket.Response<any>,
                options: HookOptions
            ) => void
        ): void;
        error(
            name: string,
            callback: (error: HookError, options: HookOptions) => void
        ): void;
        wrap(
            name: string,
            callback: (
                request: (
                    options: HookOptions
                ) => Promise<BaseBitbucket.Response<any>>,
                options: HookOptions
            ) => void
        ): void;
    };
}

export class Bitbucket extends BaseBitbucket {
    @inject() cache: Cache;

    async request(options: RequestOptions): Promise<any>{
        const key= hash(options)
        return this.cache.wrap(key, async()=>{
            return super['request'](options)
        })

    }
}
