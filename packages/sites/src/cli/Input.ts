///<reference path="../../types/inquirer.d.ts"/>

import { CheckboxChoiceMap, DirectoryQuestion, DistinctChoice, DistinctQuestion, EditorQuestion, ListChoiceMap, PathQuestion, prompt, registerPrompt } from 'inquirer';

registerPrompt('path', require('inquirer-fuzzy-path'));
registerPrompt('directory', require('inquirer-directory'));

export class Input {
    public static async question(question: DistinctQuestion) {
        let answers = await prompt<any>({ name: 'question', ...question } as any);
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

    public static async editor(message: string, question: Partial<EditorQuestion>) {
        // process.env.EDITOR = 'code --new-window --wait --file-uri';
        // process.env.EDITOR = 'idea-php --wait';
        // process.env.EDITOR = process.env.VISUAL || process.env.EDITOR || 'xed';
        process.env.EDITOR = await this.list('Editor', [
            { name: 'code', value: 'code --new-window --wait --file-uri' },
            { name: 'idea-php', value: 'idea-php --wait' },
            { name: 'idea-frontend', value: 'idea-frontend --wait' },
            { name: 'xed', value: 'xed' },
        ], 'xed');
        return await this.question({ type: 'editor', message, ...question });
    }

}
