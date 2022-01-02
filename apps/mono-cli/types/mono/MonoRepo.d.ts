import { PackageJson, macro } from '@radic/shared';
import { Package } from './Package';
import { PackageBuilder } from './PackageBuilder';
import { PackageCollection } from './PackageCollection';
export interface MonoRepoOptions {
    rootPackagePath?: string;
    workspaces?: boolean;
    packagePaths?: string[];
}
export interface MonoRepo extends macro.Proxy<MonoRepo> {
}
export declare class MonoRepo {
    options: MonoRepoOptions;
    rootPath?: string;
    pkg: PackageJson;
    packages: PackageCollection;
    readonly hooks: {};
    constructor(options: MonoRepoOptions);
    protected handlePackages(): void;
    path(...parts: any[]): string;
    getPackage(name: string): Package;
    get packagesArray(): Package[];
    getBuilderOrder(): Promise<string[]>;
    get builders(): Record<string, PackageBuilder>;
    getOrderedBuilders(): Promise<PackageBuilder[]>;
}