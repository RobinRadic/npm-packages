import { Compiler } from 'webpack';
import * as fs from 'fs';
import { set } from 'lodash';

export = ScssVariableToTypescript
namespace ScssVariableToTypescript {
    export interface Options {
        mapVariableName?: string
        sourceFile: string
        destFile: string
    }

    export type Variables = { scss: any[]; camel: any []; css: any [], dot: any[] }
}

class ScssVariableToTypescript {
    constructor(protected options: ScssVariableToTypescript.Options) {
        this.options = {
            mapVariableName: '$_variables',
            ...options,
        };
    }

    protected mtimeMs: number;

    public apply(compiler: Compiler): void {
        compiler.hooks.beforeCompile.tap('ScssVariableToTypescriptOptions', () => {
            const stats = fs.statSync(this.options.sourceFile);
            if ( this.mtimeMs !== stats.mtimeMs ) {
                this.mtimeMs    = stats.mtimeMs;
                const content   = fs.readFileSync(this.options.sourceFile, 'UTF-8').toString();
                const formatted = this.format(this.getVariables(content));
                fs.writeFileSync(this.options.destFile, formatted, 'UTF-8');
            }
        });
    }

    protected getVariableName() {
        let name = this.options.mapVariableName.trim();
        if ( name.startsWith('$') ) {
            name = name.slice(1);
        }
        return name;
    }

    getVariables(content: string): ScssVariableToTypescript.Variables {
        let variables: ScssVariableToTypescript.Variables = { scss: [], camel: [], css: [], dot: [] };
        const VARIABLES_REGEX                             = new RegExp([ '\\$', this.getVariableName(), ':\\s*\\((.*?)\\);' ].join(''), 'gis'); //  /\$_variables: \((.*?)\);/gis
        let match                                         = content.match(VARIABLES_REGEX);
        if ( match !== null ) {
            let lines = match[ 0 ].split('\n');
            lines.shift();
            lines.pop();
            variables.scss  = lines.map(line => line.split(':')[ 0 ].trim());
            variables.camel = variables.scss.map(variable => this.camelCase(variable));
            variables.css   = variables.scss.map(v => `--${v}`);
            variables.dot   = variables.scss.map(variable => variable.replace(/-/g, '.'));
        }

        return variables;
    }

    camelCase(str) {
        const CAMEL_CASE_REGEX = /(?:-|\s)+([^-\s])/g;
        str                    = str.replace(CAMEL_CASE_REGEX, (_, b) => b.toUpperCase());
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    }

    format(variables: ScssVariableToTypescript.Variables, tab: string | number = 4) {
        const toJSON = (vars, replacers: any = []) => {
            let res = JSON.stringify(vars, null, Number.isNaN(parseInt(tab as any)) ? tab : parseInt(tab as any));
            for ( let key in replacers ) {
                res = res.replace(replacers[ key ][ 0 ], replacers[ key ][ 1 ]);
            }
            return res;
        };

        let parts = {};
        variables.dot.forEach(variable => set(parts, variable, 'any'));


        let tpl = `
        
export type SCSSVariableName = ${toJSON(variables.scss, [
            [ /\s*,\s*/g, '|' ],
            [ /[\n\[\]]/g, '' ],
        ])}
export type CSSVariableName = ${toJSON(variables.css, [
            [ /\s*,\s*/g, '|' ],
            [ /[\n\[\]]/g, '' ],
        ])}
export type CamelVariableName = ${toJSON(variables.camel, [
            [ /\s*,\s*/g, '|' ],
            [ /[\n\[\]]/g, '' ],
        ])}
export type DotVariableName = ${toJSON(variables.dot, [
            [ /\s*,\s*/g, '|' ],
            [ /[\n\[\]]/g, '' ],
        ])}
        
export interface StylingVariableNames {
    scss:SCSSVariableName[] 
    css:CSSVariableName[] 
    camel:CamelVariableName[] 
    dot:DotVariableName[] 
}      

export interface DotVariableStructure ${toJSON(parts, [
            [ /"any"/g, 'any' ],
            [ /":/g, '"?:' ],
        ])}

export const scssVariableNames:SCSSVariableName[] = ${toJSON(variables.scss, [ [ /\n/g, '' ] ])}

        `;
// `
//     css: ${toJSON(variables.css, [ [ /\n/g, '' ] ])},
//     js: ${toJSON(variables.js, [ [ /\n/g, '' ] ])},
// `

        // console.log(tpl);


        return tpl;

    };
}
