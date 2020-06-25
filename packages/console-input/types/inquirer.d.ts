// noinspection ES6UnusedImports
import inquirer, { Answers, Question } from 'inquirer';

declare module 'inquirer' {

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    interface PathQuestionOptions<T extends Answers = Answers> extends Question<T> {
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
        excludePath?:any// nodePath => nodePath.startsWith('node_modules'),
        // excludePath :: (String) -> Bool
        // excludePath to exclude some paths from the file-system scan
        excludeFilter?:any//: nodePath => nodePath == '.',
        // excludeFilter :: (String) -> Bool
        // excludeFilter to exclude some paths from the final list, e.g. '.'
        itemType?:any//: 'any',
        // itemType :: 'any' | 'directory' | 'file'
        // specify the type of nodes to display
        // default value: 'any'
        // example: itemType: 'file' - hides directories from the item list
        rootPath?:any//: 'app',
        // rootPath :: String
        // Root search directory
        suggestOnly?:any//: false,
        // suggestOnly :: Bool
        // Restrict prompt answer to available choices or use them as suggestions
        depthLimit?:any//: 5,
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
    interface PathQuestion<T extends Answers = Answers> extends PathQuestionOptions<T> {
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
    interface DirectoryQuestionOptions<T extends Answers = Answers> extends Question<T> {
        basePath?:string
    }

    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    interface DirectoryQuestion<T extends Answers = Answers> extends DirectoryQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'directory';
    }

    export interface QuestionMap {
        path: PathQuestion
        directory: DirectoryQuestion
    }

}
