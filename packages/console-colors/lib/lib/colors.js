"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLength = exports.isAllLength = exports.isAnyLength = exports.Colors = void 0;
const supports = __importStar(require("supports-color"));
const convert = __importStar(require("color-convert"));
const trucolor_1 = require("trucolor");
function isLength(value, lengths) {
    lengths = lengths.length === 1 && Array.isArray(lengths[0]) ? lengths[0] : lengths;
    let vLen;
    if (value.length)
        vLen = value.length;
    else if (isFinite(value))
        vLen = parseInt(value);
    else
        return [false];
    let lens = [];
    lengths.map((val) => parseInt(val)).forEach((len) => lens[len] = vLen === len);
    return lens;
}
let isAnyLength = (value, ...lengths) => isLength(value, lengths).indexOf(true) !== -1;
exports.isAnyLength = isAnyLength;
exports.isLength = isAnyLength;
let isAllLength = (value, ...lengths) => isLength(value, lengths).indexOf(false) === -1;
exports.isAllLength = isAllLength;
class Colors {
    constructor() {
        //static created: AnsiCreator[] = []
        this.palette = trucolor_1.simple();
    }
    get convert() { return convert; }
    get supports() { return supports; }
    get(color, close) {
        let _color = this.palette[color] ? this.palette[color] : this.getTrucolorColor(color);
        return _color[close ? 'out' : 'in'];
    }
    getTrucolorColor(color) {
        //return trucolor.bulk(trucolor.simplePalette(), { color }).color
        return trucolor_1.trucolor(color, this.palette);
        // return require('deep-assign')(this.palette, trucolor.bulk({}, { color })).color;
    }
    getStyles() {
        //return trucolor.bulk(trucolor.simplePalette(), { color }).color
        return this.palette;
    }
    styles(styles) {
        this.palette = trucolor_1.palette(this.palette, styles);
        // this.palette = require('deep-assign')(this.palette, trucolor.bulk({}, styles));
        return this;
    }
    reset() {
        this.palette = trucolor_1.palette();
        return this;
    }
}
exports.Colors = Colors;
//# sourceMappingURL=colors.js.map