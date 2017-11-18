import { AbstractInteractiveModel } from "./Models/AbstractInteractiveModel";
import { InputHelper } from "@radic/console";
import { Answers, ChoiceType } from "inquirer";
/**
 * @link https://github.com/sboudrias/Inquirer.js#list---type-list
 * @link https://github.com/mokkabonna/inquirer-autocomplete-prompt
 * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
 */
export declare type InteractionSchemaPropertyType = string | 'input' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox' | 'password' | 'autocomplete' | 'datetime';
/**
 * @link https://github.com/sboudrias/Inquirer.js
 * @link https://github.com/mokkabonna/inquirer-autocomplete-prompt
 * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
 */
export interface InteractionSchemaProperty {
    [key: string]: any;
    type?: InteractionSchemaPropertyType;
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
    validate?(input: string): Promise<boolean | string> | boolean | string;
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
    /** @link https://github.com/mokkabonna/inquirer-autocomplete-prompt */
    source?: <T>(answersSoFar, input) => Promise<T>;
    /** @link https://github.com/mokkabonna/inquirer-autocomplete-prompt */
    suggestOnly?: boolean;
    /**
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     * @link https://www.npmjs.com/package/dateformat
     */
    format?: string[];
    /**
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     */
    date?: {
        min?: string;
        max?: string;
    };
    /**
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     */
    time?: {
        min?: string;
        max?: string;
        minutes?: {
            interval: number;
        };
    };
}
export interface InteractionSchema {
    resolve?: {
        message?: boolean;
        default?: boolean;
        validate?: boolean;
        type?: boolean;
    };
    properties?: {
        [field: string]: InteractionSchemaProperty;
    };
}
export declare class ModelInteractor {
    protected model: AbstractInteractiveModel;
    protected cls: typeof AbstractInteractiveModel;
    protected properties: InteractionSchemaProperty[];
    protected fieldNames: string[];
    private _ask;
    constructor(model: AbstractInteractiveModel, cls: typeof AbstractInteractiveModel);
    protected initSchemaProperties(fieldNames?: string[]): void;
    readonly ask: InputHelper;
    property(name: string): number | ((...items: InteractionSchemaProperty[]) => number) | {
        <S extends InteractionSchemaProperty>(callbackfn: (value: InteractionSchemaProperty, index: number, array: InteractionSchemaProperty[]) => value is S, thisArg?: any): S[];
        (callbackfn: (value: InteractionSchemaProperty, index: number, array: InteractionSchemaProperty[]) => any, thisArg?: any): InteractionSchemaProperty[];
    } | ((searchElement: InteractionSchemaProperty, fromIndex?: number) => boolean) | (() => string) | (() => InteractionSchemaProperty) | {
        (...items: ReadonlyArray<InteractionSchemaProperty>[]): InteractionSchemaProperty[];
        (...items: (InteractionSchemaProperty | ReadonlyArray<InteractionSchemaProperty>)[]): InteractionSchemaProperty[];
    } | ((separator?: string) => string) | (() => InteractionSchemaProperty[]) | ((start?: number, end?: number) => InteractionSchemaProperty[]) | ((compareFn?: (a: InteractionSchemaProperty, b: InteractionSchemaProperty) => number) => InteractionSchemaProperty[]) | {
        (start: number, deleteCount?: number): InteractionSchemaProperty[];
        (start: number, deleteCount: number, ...items: InteractionSchemaProperty[]): InteractionSchemaProperty[];
    } | ((searchElement: InteractionSchemaProperty, fromIndex?: number) => number) | ((callbackfn: (value: InteractionSchemaProperty, index: number, array: InteractionSchemaProperty[]) => boolean, thisArg?: any) => boolean) | ((callbackfn: (value: InteractionSchemaProperty, index: number, array: InteractionSchemaProperty[]) => void, thisArg?: any) => void) | (<U>(callbackfn: (value: InteractionSchemaProperty, index: number, array: InteractionSchemaProperty[]) => U, thisArg?: any) => U[]) | {
        (callbackfn: (previousValue: InteractionSchemaProperty, currentValue: InteractionSchemaProperty, currentIndex: number, array: InteractionSchemaProperty[]) => InteractionSchemaProperty): InteractionSchemaProperty;
        (callbackfn: (previousValue: InteractionSchemaProperty, currentValue: InteractionSchemaProperty, currentIndex: number, array: InteractionSchemaProperty[]) => InteractionSchemaProperty, initialValue: InteractionSchemaProperty): InteractionSchemaProperty;
        <U>(callbackfn: (previousValue: U, currentValue: InteractionSchemaProperty, currentIndex: number, array: InteractionSchemaProperty[]) => U, initialValue: U): U;
    } | (() => IterableIterator<[number, InteractionSchemaProperty]>) | (() => IterableIterator<number>) | (() => IterableIterator<InteractionSchemaProperty>) | {
        <S extends InteractionSchemaProperty>(predicate: (this: void, value: InteractionSchemaProperty, index: number, obj: InteractionSchemaProperty[]) => value is S, thisArg?: any): S;
        (predicate: (value: InteractionSchemaProperty, index: number, obj: InteractionSchemaProperty[]) => boolean, thisArg?: any): InteractionSchemaProperty;
    } | ((predicate: (value: InteractionSchemaProperty, index: number, obj: InteractionSchemaProperty[]) => boolean, thisArg?: any) => number) | ((value: InteractionSchemaProperty, start?: number, end?: number) => InteractionSchemaProperty[]) | ((target: number, start: number, end?: number) => InteractionSchemaProperty[]);
    getPropertyArrayFor(fieldNames: string | string[], overrides?: {
        [key: string]: InteractionSchemaProperty;
    }): InteractionSchemaProperty[];
    askFor(fieldNames: string | string[], overrides?: {
        [key: string]: InteractionSchemaProperty;
    }): Promise<any>;
    setDefaultsFor(defaults: {
        [key: string]: any;
    }): this;
    create<T extends AbstractInteractiveModel>(fieldNames: string | string[], overrides?: {
        [key: string]: InteractionSchemaProperty;
    }, set?: {
        [key: string]: any;
    }): Promise<T>;
    update<T extends AbstractInteractiveModel>(id: number, fieldNames: string | string[], overrides?: {
        [key: string]: InteractionSchemaProperty;
    }, set?: {
        [key: string]: any;
    }): Promise<T>;
    remove(name?: string): Promise<boolean>;
    pick<T extends AbstractInteractiveModel>(exclude?: string[], msg?: string): Promise<T>;
    onError(err: any): void;
}
