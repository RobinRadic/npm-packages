import { dirname, resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import * as _ from 'lodash';
import * as scss from 'node-sass';
import * as pug from "pug";

export type Parser = (content: string) => string

export function addDefaultSCSSTemplateParser() {
    Template.addParser('scss', function (this: Template, content: string) {
        let result = require('node-sass').renderSync({
            file: this.getFilePath()
        })
        content    = result.css.toString();
        return content;
    })
}
export function addDefaultPUGTemplateParser(options:pug.Options, locals:object={}) {
    let pugLocals = {}
    Template.addParser('pug', function (this: Template, content: string) {
        let compile = require('pug').compile(content, _.merge(options, <pug.Options>{
            pretty  : true,
            filename: this.getFilePath(),
            basedir : resolve('scripts/templates/docs')
        }));
        return compile(_.merge(pugLocals, locals))
    })
}

export function addDefaultMDTOCTemplateParser(readme) {
    Template.addParser('mdtoc', (content) => {
        let toc = require('markdown-toc')(content, readme)
        return content.replace('[[TOC]]', toc.content);
    });
}

export class Template {
    protected filePath: string;

    protected static parsers: { [name: string]: Parser } = {}

    static addParser(name: string, parser: Parser) {
        this.parsers[ name ] = parser;
    }


    protected content: string;

    getFilePath(): string { return this.filePath}

    setFilePath(filePath: string): this {
        this.filePath = filePath;
        return this
    }

    setContent(content: string): this {
        this.content = content;
        return this
    }

    parse(this: this, parser: Parser): this {
        this.content = parser.apply(this, [ this.content ])
        return this;
    }

    applyParsers(names: string[]): this {

        names.forEach(name => {
            if ( false === Object.keys(Template.parsers).includes(name) ) {
                console.error(`Cannot apply parser [${name}] as it does not exist!`)
            }
            this.parse(Template.parsers[ name ])
        })
        return this
    }

    writeTo(filePath, force: boolean = false): this {
        filePath = resolve(filePath)
        if ( existsSync(filePath) && force === false ) {
            console.error(`Could not write template to [${filePath}]. File already exists. Set force parameter to true if you want to overwrite`)
        }
        ensureDirSync(dirname(filePath))
        // this.r.log(`ensured dir [${dirname(filePath)}]. Going to write to [${filePath}]`)
        writeFileSync(filePath, this.content, {
            encoding: 'utf-8'
        })
        return this
    }

    read() {return this.content; }
}