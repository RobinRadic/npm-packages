import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { InlinePackage } from '../interfaces';

export namespace Packagist {
    export interface SearchResult {
        name: string // "[vendor]/[package]",
        description: string // "[description]",
        url: string // "https://packagist.org/packages/[vendor]/[package]",
        repository: string // [repository url],
        downloads: number // [number of downloads],
        favers: number // [number of favers]
    }

    export interface SearchResponse {
        total: number
        results: SearchResult[]
        next?: string
    }

    export interface Package {
        name: string // "[vendor]/[package],
        description: string // [description],
        time: string // [packagist package creation datetime],
        maintainers: any[] // [list of maintainers],
        versions: Record<string, InlinePackage> // [list of versions and their dependencies, the same data of composer.json]
        type: string // [package type],
        repository: string // [repository url],
        'downloads': {
            total: number
            monthly: number
            daily: number
        },
        favers: number
    }

    export interface Options {
        username?: string
        token?: string
        url: string
        throwErrors?: boolean
        showErrors?: boolean
    }

    export interface ResponseError extends Error, AxiosResponse {

    }
}

export class Packagist {
    protected client: AxiosInstance;
    protected options: Packagist.Options

    constructor(options: Packagist.Options = {} as any) {
        this.options = options = {
            throwErrors: true,
            showErrors : true,
            ...options,
        }
        this.client  = Axios.create({
            baseURL     : options.url,
            responseType: 'json',
            headers     : {
                'Content-Type': 'application/json',
            },
            params      : {
                username: options.username,
                apiToken: options.token,
            },
            data        : {
                username: options.username,
                apiToken: options.token,
            },
        })
        /** @see https://github.com/axios/axios/issues/41#issuecomment-124162471 */
        this.client.interceptors.response.use(res => {
            return res;
        }, err => {
            return err;
        })
        this.client.interceptors.request.use(req => {
            req.params = {
                username: options.username,
                apiToken: options.token,
            };
            return req;
        }, err => {
            return err;
        })
    }


    search(query: string, options?: { tags?: string[], type?: string }) {}

    async list(filters?: { vendor?: string, type?: string }) {
        const response = await this.client.get('/packages/list.json', { params: filters })
        return response;
    }

    async getPackage(vendor, name): Promise<Packagist.Package> {
        const response = await this.client.get(`/packages/${vendor}/${name}.json`)
        return response && response.data ? response.data.package : null;
    }

    async hasPackage(vendor, name): Promise<boolean> {
        const response = await this.getPackage(vendor, name)
        return response !== null
    }

    async addPackage(url) {
        const response = await this.client.post('/api/create-package', {
            repository: { url },
        })
        return response.data;
    }

    updatePackage() {}

    editPackage() {}

    getJob() {}

    trackDownload() {}

    trackDownloads() {}
}
