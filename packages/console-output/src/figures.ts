import { Figures, IParser } from './interfaces';
import { Output }           from './Output';

const escapeStringRegexp = require('escape-string-regexp');

const platform = process.platform;

const main: Figures = {
    tick              : '✔',
    cross             : '✖',
    star              : '★',
    square            : '▇',
    squareSmall       : '◻',
    squareSmallFilled : '◼',
    play              : '▶',
    circle            : '◯',
    circleFilled      : '◉',
    circleDotted      : '◌',
    circleDouble      : '◎',
    circleCircle      : 'ⓞ',
    circleCross       : 'ⓧ',
    circlePipe        : 'Ⓘ',
    circleQuestionMark: '?⃝',
    bullet            : '●',
    dot               : '․',
    line              : '─',
    ellipsis          : '…',
    pointer           : '❯',
    pointerSmall      : '›',
    info              : 'ℹ',
    warning           : '⚠',
    hamburger         : '☰',
    smiley            : '㋡',
    mustache          : '෴',
    heart             : '♥',
    arrowUp           : '↑',
    arrowDown         : '↓',
    arrowLeft         : '←',
    arrowRight        : '→',
    radioOn           : '◉',
    radioOff          : '◯',
    checkboxOn        : '☒',
    checkboxOff       : '☐',
    checkboxCircleOn  : 'ⓧ',
    checkboxCircleOff : 'Ⓘ',
    questionMarkPrefix: '?⃝',
    oneHalf           : '½',
    oneThird          : '⅓',
    oneQuarter        : '¼',
    oneFifth          : '⅕',
    oneSixth          : '⅙',
    oneSeventh        : '⅐',
    oneEighth         : '⅛',
    oneNinth          : '⅑',
    oneTenth          : '⅒',
    twoThirds         : '⅔',
    twoFifths         : '⅖',
    threeQuarters     : '¾',
    threeFifths       : '⅗',
    threeEighths      : '⅜',
    fourFifths        : '⅘',
    fiveSixths        : '⅚',
    fiveEighths       : '⅝',
    sevenEighths      : '⅞',
};

const win: Figures = {
    tick              : '√',
    cross             : '×',
    star              : '*',
    square            : '█',
    squareSmall       : '[ ]',
    squareSmallFilled : '[█]',
    play              : '►',
    circle            : '( )',
    circleFilled      : '(*)',
    circleDotted      : '( )',
    circleDouble      : '( )',
    circleCircle      : '(○)',
    circleCross       : '(×)',
    circlePipe        : '(│)',
    circleQuestionMark: '(?)',
    bullet            : '*',
    dot               : '.',
    line              : '─',
    ellipsis          : '...',
    pointer           : '>',
    pointerSmall      : '»',
    info              : 'i',
    warning           : '‼',
    hamburger         : '≡',
    smiley            : '☺',
    mustache          : '┌─┐',
    heart             : main.heart,
    arrowUp           : main.arrowUp,
    arrowDown         : main.arrowDown,
    arrowLeft         : main.arrowLeft,
    arrowRight        : main.arrowRight,
    radioOn           : '(*)',
    radioOff          : '( )',
    checkboxOn        : '[×]',
    checkboxOff       : '[ ]',
    checkboxCircleOn  : '(×)',
    checkboxCircleOff : '( )',
    questionMarkPrefix: '？',
    oneHalf           : '1/2',
    oneThird          : '1/3',
    oneQuarter        : '1/4',
    oneFifth          : '1/5',
    oneSixth          : '1/6',
    oneSeventh        : '1/7',
    oneEighth         : '1/8',
    oneNinth          : '1/9',
    oneTenth          : '1/10',
    twoThirds         : '2/3',
    twoFifths         : '2/5',
    threeQuarters     : '3/4',
    threeFifths       : '3/5',
    threeEighths      : '3/8',
    fourFifths        : '4/5',
    fiveSixths        : '5/6',
    fiveEighths       : '5/8',
    sevenEighths      : '7/8',
};

if ( platform === 'linux' ) {
    // The main one doesn't look that good on Ubuntu
    main.questionMarkPrefix = '?';
}

const figures: Figures = platform === 'win32' ? win : main;

const fn = str => {
    if ( figures === main ) {
        return str;
    }

    Object.keys(main).forEach(key => {
        if ( main[ key ] === figures[ key ] ) {
            return;
        }

        str = str.replace(new RegExp(escapeStringRegexp(main[ key ]), 'g'), figures[ key ]);
    });

    return str;
};
Object.assign(fn, figures);
export { figures, fn };

const getFiguresExp = (): RegExp => /\[\[(.*?)\]\]/g;
const hasFigures    = (text): boolean => getFiguresExp().test(text);

export class FiguresParser implements IParser {
    constructor(public output: Output) {}

    public getFiguresExp(): RegExp { return /\[\[(.*?)\]\]/g; }

    public hasFigures(text: string): boolean {return this.getFiguresExp().test(text); }

    public clean(text: string): string {
        if ( hasFigures(text) ) {
            text.replace(this.getFiguresExp(), '');
        }
        return text;
    }

    public parse(text: string): string {
        if ( !hasFigures(text) ) {
            return text;
        }
        let match;
        while ( (match = getFiguresExp().exec(text)) !== null ) {
            if ( this.output.figures[ match[ 1 ] ] !== undefined ) {
                text = text.replace(match[ 0 ], this.output.figures[ match[ 1 ] ]);
            }
        }
        return text;
    }

}
