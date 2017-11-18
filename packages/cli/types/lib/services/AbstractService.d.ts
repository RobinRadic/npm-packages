import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { Log } from "@radic/console";
import { Credential } from "../database/Models/Credential";
import { IService, ServiceConfig, ServiceExtraFields } from "../interfaces";
import { Cache } from "../core/cache";
export declare abstract class AbstractService<T extends ServiceExtraFields = ServiceExtraFields> implements IService<T> {
    protected log: Log;
    private _credentials;
    private _client;
    protected _cache: Cache;
    private cacheResponseInterceptorId;
    service: ServiceConfig<T>;
    readonly credentials: Credential<T>;
    readonly client: AxiosInstance;
    readonly cache: Cache;
    abstract configure(options?: AxiosRequestConfig): AxiosRequestConfig;
    setCredentials(creds: Credential<T>): Promise<this>;
    enableCache(): this;
    disableCache(): this;
    isCacheEnabled(): boolean;
    protected getCacheKey(url: string, params?: any): string;
    protected getParamsHash(params: {
        [key: string]: any;
    }): string;
    protected handleCatchedError(error: any): void;
    protected handleInterceptorError(error: any): Promise<never>;
    request(config: AxiosRequestConfig): AxiosPromise;
    protected options(url: string, config?: AxiosRequestConfig): AxiosPromise;
    protected get(url: string, config?: AxiosRequestConfig): AxiosPromise;
    protected delete(url: string, config?: AxiosRequestConfig): AxiosPromise;
    protected head(url: string, config?: AxiosRequestConfig): AxiosPromise;
    protected post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
    protected put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
    protected patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
}
