import { StringType } from "@radic/util";
export declare class AuthMethod extends StringType {
    static basic: AuthMethod;
    static oauth: AuthMethod;
    static oauth2: AuthMethod;
    static token: AuthMethod;
    static key: AuthMethod;
    static getKeyName(method: AuthMethod | string): "key" | "token" | "user" | "password" | "secret" | "id" | "keyfile";
    static getSecretName(method: AuthMethod | string): "key" | "token" | "user" | "password" | "secret" | "id" | "keyfile";
    equals(method: any): boolean;
    private static getName(method, key?);
    readonly name: string;
    readonly keyName: string;
}
