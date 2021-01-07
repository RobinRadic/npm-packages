// noinspection ES6UnusedImports
import inquirer, { Answers, Question } from 'inquirer';

declare module 'inquirer' {

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface PathQuestionOptions<T extends Answers = Answers> extends Question<T> {
        /**
         * Transforms the value to display to the user.
         *
         * @param input
         * The input provided by the user.
         *
         * @param answers
         * The answers provided by the users.
         *
         * @param flags
         * Additional information about the value.
         *
         * @returns
         * The value to display to the user.
         */
        transformer?(input: any, answers: T, flags: { isFinal?: boolean }): string | Promise<string>;

        excludePath?: any// nodePath => nodePath.startsWith('node_modules'),
        // excludePath :: (String) -> Bool
        // excludePath to exclude some paths from the file-system scan
        excludeFilter?: any//: nodePath => nodePath == '.',
        // excludeFilter :: (String) -> Bool
        // excludeFilter to exclude some paths from the final list, e.g. '.'
        itemType?: any//: 'any',
        // itemType :: 'any' | 'directory' | 'file'
        // specify the type of nodes to display
        // default value: 'any'
        // example: itemType: 'file' - hides directories from the item list
        rootPath?: any//: 'app',
        // rootPath :: String
        // Root search directory
        suggestOnly?: any//: false,
        // suggestOnly :: Bool
        // Restrict prompt answer to available choices or use them as suggestions
        depthLimit?: any//: 5,
        // depthLimit :: integer >= 0
        // Limit the depth of sub-folders to scan
        // Defaults to infinite depth if undefined
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface PathQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'path';
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface DirectoryQuestionOptions<T extends Answers = Answers> extends Question<T> {
        basePath?: string
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface DirectoryQuestion<T extends Answers = Answers> extends DirectoryQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'directory';
    }

    export interface AutocompleteQuestionOptions<T> extends Question<T> {
        suggestOnly?: boolean;
        searchText?: string;
        emptyText?: string;
        default?: string;
        pageSize?: number;

        filter?(options: Array<string>): Array<string>;

        validate?(line: string): boolean;

        source(answersSoFar: Answers, input: string): Promise<Array<string>>;
    }

    export interface AutocompleteQuestion<T extends Answers = Answers> extends AutocompleteQuestionOptions<T> {
        type?: 'autocomplete';
    }


    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface DirectoryQuestionOptions<T extends Answers = Answers> extends Question<T> {
        basePath?: string
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface DirectoryQuestion<T extends Answers = Answers> extends DirectoryQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'directory';
    }


    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FiletreeQuestionOptions<T extends Answers = Answers> extends Question<T> {
        onlyShowDir?: boolean // default: false
        root?: string //default: processs.cwd()
        onlyShowValid?: boolean // if true, will only show valid files (if validate is provided). Default: false.
        hideChildrenOfValid?: boolean // if true, will hide children of valid directories (if validate is provided). Default: false.
        transformer?: Function // a hook function to transform the display of directory or file name.
        multiple?: boolean // if true, will enable to select multiple files. Default: false.
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FiletreeQuestion<T extends Answers = Answers> extends FiletreeQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'file-tree-selection';
    }


    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     * @see https://github.com/DerekTBrown/inquirer-datepicker-prompt#inquirer-datepicker-prompt
     */
    export interface DatepickerQuestionOptions<T extends Answers = Answers> extends Question<T> {
        //https://github.com/DerekTBrown/inquirer-datepicker-prompt#inquirer-datepicker-prompt
        /** @see https://github.com/felixge/node-dateformat/#mask-options */
        format?: string[]
        initial?: Date | number
        // Enter only 1/1 to 3/1
        date?: {
            min?: string,
            max?: string
        },
        // Enter only 9:00AM to 5:00PM
        time?: {
            min?: string,
            max?: string,
            minutes?: {
                interval?: number
            }
        }
    }


    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface DatepickerQuestion<T extends Answers = Answers> extends DatepickerQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'datetime';
    }


    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface MaxinputQuestionOptions<T extends Answers = Answers> extends Question<T> {
        maxLength?: number
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface MaxinputQuestion<T extends Answers = Answers> extends MaxinputQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'maxlength-input';
    }


    interface QuestionMap<T extends Answers = Answers> {
        path: PathQuestion<T>
        directory: DirectoryQuestion<T>
        autocomplete: AutocompleteQuestion<T>;
        'file-tree-selection': FiletreeQuestion<T>
        datetime: DatepickerQuestion<T>
        'maxlength-input': MaxinputQuestion<T>
    }
}
