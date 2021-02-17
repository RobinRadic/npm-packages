import { Answers, Question,prompts } from 'inquirer';
import Base from 'inquirer/lib/prompts/base';


declare namespace FileTreeSelectionPrompt {
    /**
     * Provides options for a question for the `InputPrompt`.
     *
     * @template T
     * The type of the answers.
     */
    export interface FileTreeSelectionQuestionOptions<T extends Answers = Answers> extends Question<T> {
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
    export interface FileTreeSelectionQuestion<T extends Answers = Answers> extends FileTreeSelectionQuestionOptions<T> {
        /**
         * @inheritdoc
         */
        type?: 'file-tree-selection';
    }
}

declare class FileTreeSelectionPrompt extends Base {}

export = FileTreeSelectionPrompt
