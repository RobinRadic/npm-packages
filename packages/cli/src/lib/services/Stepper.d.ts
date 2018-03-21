import { Cache } from '../core/cache';
export declare class StepperFactory {
    protected key: string;
    constructor(key: string);
    create(key: any): void;
}
export declare class Stepper {
    protected key: string;
    cache: Cache;
    constructor(key: string);
    step(): void;
}
