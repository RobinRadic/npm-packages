import { StringType } from "@radic/util";
export declare class AuthMethod extends StringType {
    static basic: any;
    static oauth: any;
    static oauth2: any;
    static token: any;
    static key: any;
    static getKeyName(method: AuthMethod | string): "token" | "key" | "user" | "password" | "secret" | "id" | "keyfile";
    static getSecretName(method: AuthMethod | string): "token" | "key" | "user" | "password" | "secret" | "id" | "keyfile";
    equals(method: any): boolean;
    private static getName(method, key?);
    readonly name: string;
    readonly keyName: string;
}
