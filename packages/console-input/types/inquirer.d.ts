// noinspection ES6UnusedImports
import inquirer, { Answers, Question } from 'inquirer';
import { FileTreeSelectionQuestion }   from 'inquirer-file-tree-selection-prompt';

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

    }

    /**
     * Provides options for a question for the `inquirer-path`.
     *
     * @template T
     * The type of the answers.
     */
    export interface PathQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'path';
        default?: string | string[] //cwd
        multi?: boolean
        directoryOnly?: boolean
    }

    /**
     * Provides options for a question for the `inquirer-fuzzy-path`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FuzzypathQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'fuzzypath';
        excludePath?: (nodePath) => boolean,
        // excludePath :: (String) -> Bool
        // excludePath to exclude some paths from the file-system scan
        excludeFilter?: (nodePath) => boolean,
        // excludeFilter :: (String) -> Bool
        // excludeFilter to exclude some paths from the final list, e.g. '.'
        itemType?: 'any' | 'directory' | 'file'
        // itemType :: 'any' | 'directory' | 'file'
        // specify the type of nodes to display
        // default value: 'any'
        // example: itemType: 'file' - hides directories from the item list
        rootPath?: string
        // rootPath :: String
        // Root search directory
        default?: string
        suggestOnly?: boolean
        // suggestOnly :: Bool
        // Restrict prompt answer to available choices or use them as suggestions
        depthLimit?: number
        // depthLimit :: integer >= 0
        // Limit the depth of sub-folders to scan
        // Defaults to infinite depth if undefined
    }

    /**
     * Provides options for a question for the `inquirer-file-path`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FilePathQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'file-path';
        basePath?: string //cwd
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FileTreePathSelectorQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'file-tree-selector';
        path?: string
        extensions?: string[]
        selectionType?: 'file' | 'folder' | 'either',
        onlyShowMatchingExtensions?: boolean
    }


    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FileFolderQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'filefolder-prompt';
        dialog?: {
            type?: string,
            config?: {
                title?: string,
                [ key: string ]: any
            }
        }
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
        fuzzypath: FuzzypathQuestion<T>
        'file-path': FilePathQuestion<T>
        filefolder: FileFolderQuestion<T>
        directory: DirectoryQuestion<T>
        autocomplete: AutocompleteQuestion<T>;
        'file-tree-selection': FileTreeSelectionQuestion<T>
        datetime: DatepickerQuestion<T>
        'maxlength-input': MaxinputQuestion<T>
    }
}
