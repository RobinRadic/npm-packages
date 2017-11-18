import { Colors } from "./colors";
export interface ParserParsedTag {
    colors: string[];
    replacements: {
        [old: string]: string;
    };
    string: string;
    replace: (text: string) => string;
}
export declare class Parser {
    colors: Colors;
    parse(text: string): string;
    clean(text: string): string;
    protected getTagsExp(): RegExp;
    protected getTextTags(text: string, tagExp: RegExp): Array<string[]>;
    protected parseTag(tag: string[]): ParserParsedTag;
    protected parseColor(color: string): string;
}
