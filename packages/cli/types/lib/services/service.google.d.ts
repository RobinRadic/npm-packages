import { AxiosInstance, AxiosRequestConfig } from "axios";
import { AbstractService } from "./AbstractService";
import { Credential } from "../database/Models/Credential";
import { Log } from "@radic/console";
import { ServiceExtraFields } from "../interfaces";
export interface GoogleServiceContacts {
    results: number;
    entries: GoogleServiceContact[];
}
export interface GoogleServiceContact {
    id?: string;
    name?: string;
    numbers?: Array<{
        type: string;
        number: string;
        primary?: boolean;
    }>;
}
export interface GoogleServiceExtraFields extends ServiceExtraFields {
    email?: string;
    token_type?: string;
    access_type?: string;
    refresh_token?: string;
    expires_at?: number;
    expires_in?: string;
    id_token?: string;
}
export declare class GoogleService extends AbstractService<GoogleServiceExtraFields> {
    protected _auth: GoogleServiceAuth;
    readonly auth: GoogleServiceAuth;
    protected requestInterceptorId: number;
    configure(options?: AxiosRequestConfig): AxiosRequestConfig;
    setCredentials(creds: Credential<GoogleServiceExtraFields>): Promise<this>;
    protected authorize(): Promise<any>;
    protected splitContactName(name: string): {
        givenName: string;
        familyName: string;
        fullName: string;
    };
    getContacts(params?: {
        q?: string;
        'max-results'?: number;
        'start-index'?: number;
        orderby?: 'lastmodified';
        sortorder?: 'ascending' | 'descending';
    }): Promise<GoogleServiceContacts>;
    setContact(id: string, data: GoogleServiceContact): Promise<any>;
    deleteContact(id: string): void;
    createContact(name: string, number: string, type?: string): Promise<string>;
}
export interface GoogleApiExchangeData {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
export declare class GoogleServiceAuth {
    protected creds: Credential;
    log: Log;
    scopes: string[];
    port: number;
    protected client: AxiosInstance;
    protected callbackUrl: string;
    protected state: string;
    protected codeChallenge: string;
    constructor(creds: Credential);
    protected getRedirectUri(): string;
    needsAuthorize(): boolean;
    needsRefresh(): boolean;
    revokeAccessToken(): Promise<any>;
    refreshAccessToken(): Promise<Credential>;
    catchError(err: any): void;
    startAuthorization(): Promise<string>;
    finishAuthorization(code: string): Promise<Credential>;
    generateBrowserUrl(): string;
}
