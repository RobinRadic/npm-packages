///<reference path="declarations.d.ts"/>

import { Answers, ChoiceType, DateType, MessageType, objects, prompt, prompts, Question, Questions, QuestionType, registerPrompt, SourceType, TimeType } from 'inquirer';
import * as _ from 'lodash';

const log = require('debug')('build-tools:input')

function ensurePromptsInstalled() {
    if ( prompts[ 'autocomplete' ] === undefined ) {
        let prompt = require('inquirer-autocomplete-prompt')
        log('registering prompt: autocomplete', prompt)
        registerPrompt('autocomplete', prompt);
    }
    if ( prompts[ 'datepicker' ] === undefined ) {
        let prompt = require('inquirer-datepicker-prompt')
        log('registering prompt: datepicker', prompt)
        registerPrompt('datepicker', prompt)
    }
}


export class Input {
    public get types(): QuestionType[] { return [ 'input', 'confirm', 'list', 'rawlist', 'expand', 'checkbox', 'password', 'autocomplete', 'datetime' ] }

    constructor(){
        ensurePromptsInstalled();
    }

    async ask(message: MessageType, def?: string): Promise<string> {
        return this.prompt<string>({ default: def, type: 'input', message })
    }

    async confirm(message: MessageType, def: boolean = true): Promise<boolean> {
        return this.prompt<boolean>({ type: 'confirm', default: def, message })
    }

    async list(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'list', choices, validate);
    }

    async rawlist(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'rawlist', choices, validate);
    }

    async expand(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'expand', choices, validate);
    }

    async checkbox(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string[]> {
        return this.multiple<string[]>(msg, 'checkbox', choices, validate);
    }

    async password(message: MessageType, def?: string, validate?: (answer) => boolean): Promise<string> {
        return this.prompt<string>({ type: 'password', default: def, message, validate })
    }

    async autocomplete(message: MessageType, source: string[] | SourceType, suggestOnly: boolean = false, validate?: (answer) => boolean): Promise<string> {
        let src: SourceType = <SourceType> source;
        if ( Array.isArray(source) ) {
            src = (answersSoFar, input): Promise<any> => {
                return Promise.resolve((<string[]> source).filter((name) => {
                    return name.startsWith(input);
                }))
            }
        }

        return this.prompt<string>({ type: 'autocomplete', message, source: src, suggestOnly, validate })
    }

    /**
     *
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     * @link https://www.npmjs.com/package/dateformat
     *
     * @returns {Promise<string>}
     */
    async datetime(message: MessageType, date?: DateType, time?: TimeType, format: string[] = [ 'd', '/', 'm', '/', 'yyyy', ' ', 'HH', ':', 'MM', ':', 'ss' ]): Promise<string> {
        return this.prompt<string>({ type: 'datetime', message, date, time, format })

    }

    async multiple<T>(message: MessageType, type: QuestionType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<T> {
        let prompt = { type, message, choices }
        if ( validate ) {
            prompt[ 'validate' ] = validate;
        }
        return this.prompt<T>(prompt)
    }

    async prompts<T extends Answers>(questions: Questions<T>): Promise<T> {
        return prompt(questions);
    }

    async prompt<T>(question: Question): Promise<T> {
        question.name = 'prompt'
        return prompt([ question ])
            .then((answers) => Promise.resolve(answers.prompt as T))
            .catch(e => Promise.reject(e))
    }

    async interact(message: string, type: string = 'input', opts: Question = {}, def?: string) {
        return <Promise<string>> new Promise((resolve, reject) => {
            let question = _.merge({ name: 'ask', message, type, default: def }, opts)
            prompt(question).then(answers => resolve(answers.ask)).catch(e => reject(e))
        })
    }
}

export const input:Input = new Input()