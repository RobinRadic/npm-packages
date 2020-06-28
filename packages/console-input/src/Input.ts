///<reference path="../types/inquirer.d.ts"/>

import { CheckboxChoiceMap, createPromptModule, DirectoryQuestion, DistinctChoice, DistinctQuestion, EditorQuestion, ListChoiceMap, PathQuestion, registerPrompt } from 'inquirer';

import { editAsync, IFileOptions } from 'external-editor';

registerPrompt('path', require('inquirer-fuzzy-path'));
registerPrompt('directory', require('inquirer-directory'));

export class Input {
    public static prompt = createPromptModule();

    public static async question(question: DistinctQuestion) {
        let answers = await this.prompt<any>({ name: 'question', ...question } as any);
        return answers.question;
    }

    public static async input(message: string, defaultValue?: string, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ type: 'input', message, default: defaultValue, ...question });
    }

    public static async confirm(message: string, defaultValue: boolean = false, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ type: 'confirm', message, default: defaultValue, ...question });
    }

    public static async checkbox(message: string, choices: DistinctChoice<CheckboxChoiceMap>[], defaultChoice?: any, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ type: 'checkbox', message, choices, default: defaultChoice, ...question });
    }

    public static async list(message: string, choices: DistinctChoice<ListChoiceMap>[], defaultChoice?: any, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ type: 'list', message, choices, default: defaultChoice, ...question });
    }

    public static async path(message: string, question: Partial<PathQuestion> = {}) {
        return await this.question({ type: 'path', message, ...question });
    }

    public static async directory(message: string, basePath: string = process.cwd(), question: Partial<DirectoryQuestion> = {}) {
        return await this.question({ type: 'directory', message, basePath, ...question });
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
            }, { ...options })
        });

    }

}
