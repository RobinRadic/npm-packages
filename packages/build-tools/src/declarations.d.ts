
import { Answers, ChoiceType } from 'inquirer'

declare module 'inquirer' {

    interface Question {
        /**
         * Type of the prompt.
         * Possible values:
         * <ul>
         *      <li>input</li>
         *      <li>confirm</li>
         *      <li>list</li>
         *      <li>rawlist</li>
         *      <li>password</li>
         * </ul>
         * @defaults: 'input'
         */
        type?: QuestionType;
        /**
         * The name to use when storing the answer in the anwers hash.
         */
        name?: string;
        /**
         * The question to print. If defined as a function,
         * the first parameter will be the current inquirer session answers.
         */
        message?: string | ((answers: Answers) => string);
        /**
         * Default value(s) to use if nothing is entered, or a function that returns the default value(s).
         * If defined as a function, the first parameter will be the current inquirer session answers.
         */
        default?: any | ((answers: Answers) => any);
        /**
         * Choices array or a function returning a choices array. If defined as a function,
         * the first parameter will be the current inquirer session answers.
         * Array values can be simple strings, or objects containing a name (to display) and a value properties
         * (to save in the answers hash). Values can also be a Separator.
         */
        choices?: ChoiceType[] | ((answers: Answers) => ChoiceType[]);

        /**
         * Receive the user input and should return true if the value is valid, and an error message (String)
         * otherwise. If false is returned, a default error message is provided.
         */
        validate?(input: string, answers?: Answers): boolean | string;

        /**
         * Receive the user input and return the filtered value to be used inside the program.
         * The value returned will be added to the Answers hash.
         */
        filter?(input: string): string;

        /**
         * Receive the current user answers hash and should return true or false depending on whether or
         * not this question should be asked. The value can also be a simple boolean.
         */
        when?: boolean | ((answers: Answers) => boolean);
        paginated?: boolean;
        /**
         * Change the number of lines that will be rendered when using list, rawList, expand or checkbox.
         */
        pageSize?: number;
        /**
         * Add a mask when password will entered
         */
        mask?: string;
    }

    /**
     * @link https://github.com/sboudrias/Inquirer.js#list---type-list
     * @link https://github.com/mokkabonna/inquirer-autocomplete-prompt
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     */
    type QuestionType = string | 'input' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox' | 'password' | 'autocomplete' | 'datetime';
    type MessageType = string | ((answers: Answers) => string)
    type SourceType = <T>(answersSoFar: { [name: string]: string }, input: string) => Promise<T>
    type DateType = { min?: string, max?: string }
    type TimeType = { min?: string, max?: string, seconds?: { interval: number }, minutes?: { interval: number }, hours?: { interval: number } }

    interface Question {
        message?: MessageType
        type?: QuestionType
        /** @link https://github.com/mokkabonna/inquirer-autocomplete-prompt */
        source?: SourceType
        /** @link https://github.com/mokkabonna/inquirer-autocomplete-prompt */
        suggestOnly?: boolean

        /**
         * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
         * @link https://www.npmjs.com/package/dateformat
         */
        format?: string[]

        /**
         * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
         */
        date?: DateType

        /**
         * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
         */
        time?: TimeType
    }
}

