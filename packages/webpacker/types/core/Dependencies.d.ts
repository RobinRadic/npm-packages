export interface MissingPackages {
    hasMissing: boolean;
    missing: number;
    all: string[];
    dependencies: string[];
    devDependencies: string[];
}
export declare class Dependencies {
    protected dependencies: string[];
    protected devDependencies: string[];
    add(...dependencies: string[]): this;
    push(to: 'devDependencies' | 'dependencies', name: string): void;
    getAll(): any[];
    get(): string[];
    getDev(): string[];
    getMissingPackages(installedPackages: string[]): MissingPackages;
}
