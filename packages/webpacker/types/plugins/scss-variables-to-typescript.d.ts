import { Compiler } from 'webpack';
export declare namespace ScssVariableToTypescript {
    interface Options {
        mapVariableName?: string;
        sourceFile: string;
        destFile: string;
    }
    type Variables = {
        scss: any[];
        camel: any[];
        css: any[];
        dot: any[];
    };
}
export default class ScssVariableToTypescript {
    protected options: ScssVariableToTypescript.Options;
    constructor(options: ScssVariableToTypescript.Options);
    protected mtimeMs: number;
    apply(compiler: Compiler): void;
    protected getVariableName(): string;
    getVariables(content: string): ScssVariableToTypescript.Variables;
    camelCase(str: any): any;
    format(variables: ScssVariableToTypescript.Variables, tab?: string | number): string;
}
