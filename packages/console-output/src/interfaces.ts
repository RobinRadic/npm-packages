import { InspectOptions } from 'util';
import { Output }         from './Output';


export type TruncateFunction = (input: string, columns: number, options?: TruncateOptions) => string
export type WrapFunction = (input: string, columns: number, options?: WrapOptions) => string;
export type SliceFunction = (inputu: string, beginSlice: number, endSlice?: number) => string;
export type WidestFunction = (input: string) => number;
export type TruncatePosition = 'start' | 'middle' | 'end'


export interface TreeData {
    label: string;
    nodes?: (TreeData | string)[];
}

export interface TreeOptions {
    prefix?: string
    unicode?: boolean;
}

export interface OutputSpinners {
    ora?: any
    multi?: any
    single?: any
}

export interface TruncateOptions {
    position?: TruncatePosition
}

export interface WrapOptions {
    /**
     * By default the wrap is soft, meaning long words may extend past the column width. Setting this to true will make it hard wrap at the column width.
     * default: false
     */
    hard?: boolean
    /**
     * By default, an attempt is made to split words at spaces, ensuring that they don't extend past the configured columns.
     * If wordWrap is false, each column will instead be completely filled splitting words as necessary.
     * default: true
     */
    wordWrap?: boolean
    /**
     * Whitespace on all lines is removed by default. Set this option to false if you don't want to trim.
     * default: true
     */
    trim?: boolean
}

export interface ColumnsOptions {
    columns?: string[]
    minWidth?: number
    maxWidth?: number
    align?: 'left' | 'right' | 'center'
    paddingChr?: string
    columnSplitter?: string
    preserveNewLines?: boolean
    showHeaders?: boolean
    dataTransform?: (data) => string
    truncate?: boolean
    truncateMarker?: string
    widths?: { [ name: string ]: ColumnsOptions }
    config?: { [ name: string ]: ColumnsOptions }
}


export interface OutputOptions {
    parsers?: {
        colors?: boolean
        figures?:boolean
        [key:string]:boolean
    }
    inspect?: InspectOptions
    quiet?: boolean,
    resetOnNewline?: boolean,
    styles?: { [ name: string ]: string | string[] },
    tableStyle?: OutputOptionsTableStyles
}


export interface OutputOptionsTableStyles {
    [ name: string ]: OutputOptionsTableStyle

    FAT?: OutputOptionsTableStyle
    SLIM?: OutputOptionsTableStyle
    NONE?: OutputOptionsTableStyle
}

export interface OutputOptionsTableStyle {
    [ name: string ]: string,

    'top'?: string,
    'top-mid'?: string,
    'top-left'?: string,
    'top-right'?: string,
    'bottom'?: string,
    'bottom-mid'?: string,
    'bottom-left'?: string,
    'bottom-right'?: string,
    'left'?: string,
    'left-mid'?: string,
    'mid'?: string,
    'mid-mid'?: string,
    'right'?: string,
    'right-mid'?: string,
    'middle'?: string,
}


export interface Figures {
    tick: string
    cross: string
    star: string
    square: string
    squareSmall: string
    squareSmallFilled: string
    play: string
    circle: string
    circleFilled: string
    circleDotted: string
    circleDouble: string
    circleCircle: string
    circleCross: string
    circlePipe: string
    circleQuestionMark: string
    bullet: string
    dot: string
    line: string
    ellipsis: string
    pointer: string
    pointerSmall: string
    info: string
    warning: string
    hamburger: string
    smiley: string
    mustache: string
    heart: string
    arrowUp: string
    arrowDown: string
    arrowLeft: string
    arrowRight: string
    radioOn: string
    radioOff: string
    checkboxOn: string
    checkboxOff: string
    checkboxCircleOn: string
    checkboxCircleOff: string
    questionMarkPrefix: string
    oneHalf: string
    oneThird: string
    oneQuarter: string
    oneFifth: string
    oneSixth: string
    oneSeventh: string
    oneEighth: string
    oneNinth: string
    oneTenth: string
    twoThirds: string
    twoFifths: string
    threeQuarters: string
    threeFifths: string
    threeEighths: string
    fourFifths: string
    fiveSixths: string
    fiveEighths: string
    sevenEighths: string
}


export interface OutputStylesConfig {
    [ key: string ]: ColorStyle

    default?: ColorStyle
}

export interface OutputConfig {
    colors?: true,
    figures?: true,
    styles?: OutputStylesConfig
}

export interface IParserConstructor {
    new(output: Output):IParser

    prototype: IParser
}

export interface IParser {
    output: Output
    parse(text: string): string

    clean(text: string): string
}

export type ColorStyles = Record<string, ColorStyle>
export type ColorStyle = string | string[]

export interface Figures {
    tick: string
    cross: string
    star: string
    square: string
    squareSmall: string
    squareSmallFilled: string
    play: string
    circle: string
    circleFilled: string
    circleDotted: string
    circleDouble: string
    circleCircle: string
    circleCross: string
    circlePipe: string
    circleQuestionMark: string
    bullet: string
    dot: string
    line: string
    ellipsis: string
    pointer: string
    pointerSmall: string
    info: string
    warning: string
    hamburger: string
    smiley: string
    mustache: string
    heart: string
    arrowUp: string
    arrowDown: string
    arrowLeft: string
    arrowRight: string
    radioOn: string
    radioOff: string
    checkboxOn: string
    checkboxOff: string
    checkboxCircleOn: string
    checkboxCircleOff: string
    questionMarkPrefix: string
    oneHalf: string
    oneThird: string
    oneQuarter: string
    oneFifth: string
    oneSixth: string
    oneSeventh: string
    oneEighth: string
    oneNinth: string
    oneTenth: string
    twoThirds: string
    twoFifths: string
    threeQuarters: string
    threeFifths: string
    threeEighths: string
    fourFifths: string
    fiveSixths: string
    fiveEighths: string
    sevenEighths: string
}
