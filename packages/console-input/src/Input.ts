import inquirer, { Answers, AutocompleteQuestion, CheckboxChoiceMap, CheckboxQuestion, ConfirmQuestion, DatepickerQuestion, DirectoryQuestion, DistinctChoice, DistinctQuestion, EditorQuestion, FiletreeQuestion, InputQuestion, ListChoiceMap, ListQuestion, MaxinputQuestion, PathQuestion } from 'inquirer';

import { editAsync, IFileOptions } from 'external-editor';
import PromptConstructor = inquirer.prompts.PromptConstructor;

inquirer.registerPrompt('path', require('inquirer-fuzzy-path'));
inquirer.registerPrompt('directory', require('inquirer-directory'));
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
inquirer.registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'));
inquirer.registerPrompt('maxlength-input', require('@matti-o7/inquirer-maxlength-input-prompt'));
//
//
// export interface Input {
//     Separator:typeof inquirer.Separator
//     inquirer:typeof inquirer
//     prompt: typeof inquirer.prompt
// }

export class Input {
    public static get inquirer() {return inquirer; }

    public static get Separator(): typeof inquirer.Separator {return this.inquirer.Separator; }

    public static get prompt() { return this.inquirer.prompt; };

    public static register(name: string, prompt: PromptConstructor) {
        this.inquirer.registerPrompt(name, prompt);
        return this;
    }

    public static async question(question: DistinctQuestion) {
        let answers = await this.prompt<any>({ name: 'question', ...question } as any);
        return answers.question;
    }

    public static async input(message: string, defaultValue?: string, question: Partial<InputQuestion> = {}) {
        return await this.question({ type: 'input', message, default: defaultValue, ...question });
    }

    public static async confirm(message: string, defaultValue: boolean = false, question: Partial<ConfirmQuestion> = {}) {
        return await this.question({ type: 'confirm', message, default: defaultValue, ...question });
    }

    public static async checkbox(message: string, choices: DistinctChoice<CheckboxChoiceMap>[], defaultChoice?: any, question: Partial<CheckboxQuestion> = {}) {
        return await this.question({ type: 'checkbox', message, choices, default: defaultChoice, ...question });
    }

    public static async list(message: string, choices: DistinctChoice<ListChoiceMap>[], defaultChoice?: any, question: Partial<ListQuestion> = {}) {
        return await this.question({ type: 'list', message, choices, default: defaultChoice, ...question });
    }

    public static async path(message: string, question: Partial<PathQuestion> = {}) {
        return await this.question({ type: 'path', message, ...question });
    }

    public static async directory(message: string, basePath: string = process.cwd(), question: Partial<DirectoryQuestion> = {}) {
        return await this.question({ type: 'directory', message, basePath, ...question });
    }

    public static async autocomplete(message: string, source: (answersSoFar: Answers, input: string) => Promise<Array<string>>, question: Partial<AutocompleteQuestion> = {}) {
        return await this.question({ type: 'autocomplete', message, source, ...question });
    }

    public static async datetime(message: string, question: Partial<DatepickerQuestion> = {}) {
        return await this.question({ type: 'datetime', message, ...question });
    }

    public static async filetree(message: string, root: string = process.cwd(), question: Partial<FiletreeQuestion> = {}) {
        return await this.question({ type: 'file-tree-selection', message, root, ...question });
    }

    public static async maxinputlength(message: string, maxLength: number, question: Partial<MaxinputQuestion> = {}) {
        return await this.question({ type: 'maxlength-input', message, maxLength, ...question });
    }

    public static editorChoices: Array<{ name: string, value: string }> = [
        { name: 'code', value: 'code --new-window --wait --file-uri' },
        { name: 'xed', value: 'xed  --new-window --wait' },
    ];

    public static editorDefaultChoice: string = 'xed';

    public static async editor(message: string, question: Partial<EditorQuestion>) {
        // process.env.EDITOR = 'code --new-window --wait --file-uri';
        // process.env.EDITOR = 'idea-php --wait';
        // process.env.EDITOR = process.env.VISUAL || process.env.EDITOR || 'xed';
        process.env.EDITOR = await this.list('Editor', this.editorChoices, 'xed');
        return await this.question({ type: 'editor', message, ...question });
    }

    public static async edit(content: string, options?: IFileOptions) {
        return new Promise((resolve, reject) => {
            editAsync(content, (err, result) => {
                if ( err ) return reject(err);
                resolve(result);
            }, { ...options });
        });

    }

}
