import { AuthMethod } from "./AuthMethod";
import { Dictionary, IService, ServiceConfig } from "../interfaces";
import { Credential } from "../database/Models/Credential";
export declare class Services {
    protected items: Dictionary<ServiceConfig>;
    factory: (name: string, credentials: Credential) => IService;
    has(name: string): boolean;
    getNames(): string[];
    all(): Dictionary<ServiceConfig>;
    getMethodsFor(name: string): AuthMethod[];
    supportsMethod(name: string, method: AuthMethod | string): boolean;
    make<T extends IService>(name: string, credentials: Credential): T;
    get(name: string): ServiceConfig;
    register(config: ServiceConfig): void;
}
