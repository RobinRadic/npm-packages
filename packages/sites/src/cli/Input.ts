import { CheckboxChoiceMap, DistinctChoice, DistinctQuestion, ListChoiceMap, prompt } from 'inquirer';

export class Input {
    static async question(question: DistinctQuestion) {
        let answers = await prompt<any>({ name: 'question', ...question } as any);
        return answers.question;
    }

    static async input(message: string) {
        let answer = await this.question({ message, name: 'question', type: 'input' });
    }

    static async checkbox(message: string, choices: DistinctChoice<CheckboxChoiceMap>[], defaultChoice?: any, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ message, choices, type: 'checkbox', default: defaultChoice, ...question });
    }

    static async list(message: string, choices: DistinctChoice<ListChoiceMap>[], defaultChoice?: any, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ message, choices, type: 'list', default: defaultChoice, ...question });
    }
}
