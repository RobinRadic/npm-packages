import { Compiler } from 'webpack';
export declare namespace ScssVariableToTypescriptPlugin {
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
export default ScssVariableToTypescriptPlugin;
export declare class ScssVariableToTypescriptPlugin {
    protected options: ScssVariableToTypescriptPlugin.Options;
    constructor(options: ScssVariableToTypescriptPlugin.Options);
    protected mtimeMs: number;
    apply(compiler: Compiler): void;
    protected getVariableName(): string;
    getVariables(content: string): ScssVariableToTypescriptPlugin.Variables;
    camelCase(str: any): any;
    format(variables: ScssVariableToTypescriptPlugin.Variables, tab?: string | number): string;
}
