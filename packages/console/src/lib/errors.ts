export class BaseError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BaseError.prototype);
    }

    sayHello() {
        return 'hello ' + this.message;
    }
}

export class ModuleNotFoundError extends BaseError {
    code: string = 'MODULE_NOT_FOUND'

    constructor(message: string) {
        super(message);
    }
}

export class HelperDependencyMissingError extends BaseError {
    code: string = 'HELPER_DEPENDENCY_MISSING'

    constructor(helperName: string, dependencyName: string) {
        super(`Cannot start helper [${helperName}]. It depends on [${dependencyName}]. Either enable it or set config [helpers.${helperName}.enableDepends] to [true]`)
    }
}