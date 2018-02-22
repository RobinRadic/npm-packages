/// <reference types="inquirer" />
import { Questions, Answers, ChoiceType, DateType, Inquirer, MessageType, objects, Question, QuestionType, SourceType, TimeType } from 'inquirer';
import { CliExecuteCommandParseEvent, Config } from '../../core';
import { InputHelperOptionsConfig } from '../../interfaces';
export interface CheckListItem extends objects.ChoiceOption {
    name?: string;
    disabled?: string;
    checked: boolean;
    value?: string;
}
export declare class InputHelper {
    protected _config: Config;
    readonly types: QuestionType[];
    config: InputHelperOptionsConfig;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    ask(message: MessageType, def?: string): Promise<string>;
    confirm(message: MessageType, def?: string): Promise<boolean>;
    list(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string>;
    rawlist(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string>;
    expand(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string>;
    checkbox(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string[]>;
    password(message: MessageType, def?: string, validate?: (answer) => boolean): Promise<string>;
    autocomplete(message: MessageType, source: string[] | SourceType, suggestOnly?: boolean, validate?: (answer) => boolean): Promise<string>;
    /**
     *
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     * @link https://www.npmjs.com/package/dateformat
     *
     * @returns {Promise<string>}
     */
    datetime(message: MessageType, date?: DateType, time?: TimeType, format?: string[]): Promise<string>;
    multiple<T>(message: MessageType, type: QuestionType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<T>;
    prompts(questions: Questions): Promise<Answers>;
    prompt<T extends any>(question: Question): Promise<T>;
    interact(message: string, type?: string, opts?: Question, def?: string): Promise<string>;
    readonly inquirer: Inquirer;
}
