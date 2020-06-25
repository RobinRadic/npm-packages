"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const colors_1 = require("./colors");
class Parser {
    constructor() {
        this.colors = new colors_1.Colors;
    }
    parse(text) {
        if (!this.getTagsExp().test(text))
            return text;
        this.getTextTags(text, this.getTagsExp()).forEach((tag) => {
            let parsed = this.parseTag(tag);
            text = parsed.replace(text);
        });
        return text;
    }
    clean(text) {
        if (!this.getTagsExp().test(text))
            return text;
        return text.replace(this.getTagsExp(), '');
    }
    getTagsExp() {
        return /{(.*?)}/g;
    }
    getTextTags(text, tagExp) {
        let matches = [], myArr;
        while ((myArr = tagExp.exec(text)) !== null) {
            matches.push(myArr);
        }
        return matches;
    }
    parseTag(tag) {
        let replacements = {};
        tag[1].split('.').forEach((rawColor) => replacements[rawColor] = this.parseColor(rawColor));
        let colors = Object.keys(replacements).map((key) => replacements[key]);
        let string = colors.join('');
        let replace = (text) => text.replace(tag[0], string === '' ? tag[0] : string);
        return { replacements, colors, string, replace };
    }
    parseColor(color) {
        let isClose = color.charAt(0) === '/';
        color = isClose ? color.replace('/', '') : color;
        if (color.charAt(0) === 'f' || color.charAt(0) === 'b') {
            // https://regex101.com/r/SdwSKD/1
            let exp = /^([fb])([:(])(.*)([)])$/m;
            if (exp.test(color)) {
                let segments = color.match(exp);
                let _color = segments[3];
                if (segments[1] === 'b')
                    _color = 'background ' + _color;
                return this.colors.get(_color, isClose);
            }
            //throw Error('cant parase f or b in parseColor')
        }
        try {
            return this.colors.get(color, isClose);
        }
        catch (err) {
            return '';
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map