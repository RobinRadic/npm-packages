///<reference path="./globals.d.ts"/>
import * as supports               from 'supports-color';
import { supportsColor }           from 'supports-color';
import * as convert                from 'color-convert';
import { Parser }                  from './Parser';
import { ColorStyle, ColorStyles } from '../interfaces';
//import {startsWith } from 'lodash'


// import * as _ from "lodash";
// _.isNumber()
// let ansi256    = require('ansi-256-colors')
// let ansiColors = Object.keys(ansiStyles);

export interface AnsiRgbColors {
    fg: Array<number>
    bg: Array<number>
}

export class Colors {
    protected styles: ColorStyles;
    parser: Parser = new Parser(this);

    get convert(): typeof convert { return require('color-convert'); }

    get supports(): supportsColor.SupportsColor { return supports as any; }

    hasStyle(name: string) {
        return typeof this.styles[ name ] !== 'undefined';
    }

    getStyle(name: string): string | string[] {
        return this.styles[ name ];
    }

    setStyle(name: string, style: string | string[]) {
        this.styles[ name ] = style;
        return this;
    }

    setStyles(styles: ColorStyles) {
        this.styles = { ...this.styles, ...styles };
        return this;
    }

    parse(text: string): string {
        return this.parser.parse(text);
    }

    clean(text: string): string {
        return this.parser.clean(text);
    }
}
