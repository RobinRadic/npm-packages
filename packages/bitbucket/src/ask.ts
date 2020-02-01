import inquirer, { Answers, AsyncDynamicQuestionProperty, CheckboxChoiceOptions, ChoiceBase, ExpandChoiceOptions, Inquirer, ListQuestionOptions, Question, QuestionMap, RawListQuestionOptions, Separator } from 'inquirer';
import * as _ from 'lodash';
export type Questions = Question[]
export type ChoiceType<T extends Answers=Answers> = AsyncDynamicQuestionProperty<ReadonlyArray<inquirer.DistinctChoice<any>>, T>
export type MessageType = string
export type QuestionType=keyof QuestionMap
export namespace objects{
    export type ChoiceOption=ChoiceType
}
export class Ask {
    public static get types(): QuestionType[] { return [ 'input', 'confirm', 'list', 'rawList', 'expand', 'checkbox', 'password'  ] }

    static async ask(message: MessageType, def?: string): Promise<string> {
        return this.prompt<string>({ default: def, type: 'input', message })
    }


    static async confirm(message: MessageType, def?: string): Promise<boolean> {
        return this.prompt<boolean>({ type: 'confirm', default: def, message })
    }

    static async list(msg: MessageType, choices: ListQuestionOptions[], validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'list', choices, validate);
    }

    static async rawlist(msg: MessageType, choices: RawListQuestionOptions[], validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'rawList', choices, validate);
    }

    static async expand(msg: MessageType, choices: ExpandChoiceOptions[], validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'expand', choices, validate);
    }

    static async checkbox(msg: MessageType, choices: CheckboxChoiceOptions[], validate?: (answer) => boolean): Promise<string[]> {
        return this.multiple<string[]>(msg, 'checkbox', choices, validate);
    }

    static async password(message: MessageType, def?: string, validate?: (answer) => boolean): Promise<string> {
        return this.prompt<string>({ type: 'password', default: def, message, validate })
    }

    static async multiple<T>(message: MessageType, type: keyof QuestionMap, choices: ChoiceBase[], validate?: (answer) => boolean): Promise<T> {
        let prompt = { type, message, choices }
        if ( validate ) {
            prompt[ 'validate' ] = validate;
        }
        return this.prompt<T>(prompt)
    }

    static async prompts(questions: Questions): Promise<Answers> {
        return this.inquirer.prompt(questions);
    }

    static async prompt<T extends any>(question: Question): Promise<T> {
        question.name = 'prompt'
        return this.inquirer.prompt([ question ])
            .then((answers) => Promise.resolve(<T>answers.prompt))
            .catch(e => Promise.reject(e))
    }

    static get inquirer(): Inquirer {
        return require('inquirer')
    }
}