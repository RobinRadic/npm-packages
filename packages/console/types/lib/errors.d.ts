export declare class BaseError extends Error {
    constructor(m: string);
    sayHello(): string;
}
export declare class ModuleNotFoundError extends BaseError {
    code: string;
    constructor(message: string);
}
export declare class HelperDependencyMissingError extends BaseError {
    code: string;
    constructor(helperName: string, dependencyName: string);
}
