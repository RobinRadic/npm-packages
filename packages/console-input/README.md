# Console Input

Based on inquirer. Includes several extras. Main purpose is to fire 'one-off' questions

### Installation

`yarn add @radic/console-input`

### Full API
```ts
import Input from '@radic/console-input';
Input.prompt: PromptModule;
Input.register(name: string, prompt: PromptConstructor): typeof Input;
Input.question(question: DistinctQuestion): Promise<any>;
Input.input(message: string, defaultValue?: string, question?: Partial<InputQuestion>): Promise<any>;
Input.confirm(message: string, defaultValue?: boolean, question?: Partial<ConfirmQuestion>): Promise<any>;
Input.checkbox(message: string, choices: DistinctChoice<CheckboxChoiceMap>[], defaultChoice?: any, question?: Partial<CheckboxQuestion>): Promise<any>;
Input.list(message: string, choices: DistinctChoice<ListChoiceMap>[], defaultChoice?: any, question?: Partial<ListQuestion>): Promise<any>;
Input.path(message: string, question?: Partial<PathQuestion>): Promise<any>;
Input.directory(message: string, basePath?: string, question?: Partial<DirectoryQuestion>): Promise<any>;
Input.autocomplete(message: string, source: (answersSoFar: Answers, input: string) => Promise<Array<string>>, question?: Partial<AutocompleteQuestion>): Promise<any>;
Input.datetime(message: string, question?: Partial<DatepickerQuestion>): Promise<any>;
Input.filetree(message: string, root?: string, question?: Partial<FiletreeQuestion>): Promise<any>;
Input.editor(message: string, question: Partial<EditorQuestion>): Promise<any>;
Input.edit(content: string, options?: IFileOptions): Promise<unknown>;
```

*Created and/or modified all type definitions for each package it's options as can be checked in [types/inquirer.d.ts](types/inquirer.d.ts)*

**Integrated third party features**
- [inquirer-fuzzy-path](https://www.npmjs.com/package/inquirer-fuzzy-path)
- [inquirer-directory](https://www.npmjs.com/package/inquirer-directory)
- [inquirer-autocomplete-prompt](https://www.npmjs.com/package/inquirer-autocomplete-prompt)
- [inquirer-datepicker-prompt](https://www.npmjs.com/package/inquirer-datepicker-prompt)
- [inquirer-file-tree-selection-prompt](https://www.npmjs.com/package/inquirer-file-tree-selection-prompt)
- [@matti-o7/inquirer-maxlength-input-prompt](https://www.npmjs.com/package/@matti-o7/inquirer-maxlength-input-prompt)
- [external-editor](https://www.npmjs.com/package/external-editor)


### Some examples
[More examples here](src/examples.ts)

```ts
if(await Input.confirm('Are you sure', true)){
    console.log('yes');
}
```
```ts
let choice = await Input.checkbox('Pick your foods', ['apples','pears','bananas']);
```
```ts
let choice = await Input.checkbox('Pick your food', [
    { checked: true,        key    : 'apples',        value  : 'Apples',    },
    Input.Separator(1),
    { checked: true,        key    : 'cheese',        value  : 'Cheese',    },
]);
```
```ts
let files = await ask.filetree('Pick the files you wish to delete', '/path/to/root', {
    multiple: true,
    root: '/path/to/root' // you can override parameters again in the options if you'd like
})
files.forEach(filePath => rm('-rf', filePath))
```
