import { CheckboxChoiceOptions, DistinctQuestion, prompt } from 'inquirer';

export class Ask {
    static async question(question: DistinctQuestion) {
        let answers = await prompt<any>({ name: 'question', ...question } as any);
        return answers.question;
    }

    static async input(message: string) {
        let answer = await this.question({ message, name: 'question', type: 'input' });
    }

    static async checkbox(message: string, choices: CheckboxChoiceOptions[], defaultChoice?: any, question: Partial<DistinctQuestion> = {}) {
        return await this.question({ message, choices, type: 'checkbox', default: defaultChoice, ...question });
    }
}
