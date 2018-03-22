import { InspectOptions } from "util";

export type TruncateFunction = (input: string, columns: number, options?: TruncateOptions) => string
export type WrapFunction = (input: string, columns: number, options?: WrapOptions) => string;
export type SliceFunction = (inputu: string, beginSlice: number, endSlice?: number) => string;
export type WidestFunction = (input: string) => number;
export type TruncatePosition = 'start' | 'middle' | 'end'


export interface TreeData {
    label: string;
    nodes?: (TreeData | string)[];
}

export interface TreeOptions {
    prefix?: string
    unicode?: boolean;
}

export interface OutputSpinners {
    ora?: any
    multi?: any
    single?: any
}

export interface TruncateOptions {
    position?: TruncatePosition
}

export interface WrapOptions {
    /**
     * By default the wrap is soft, meaning long words may extend past the column width. Setting this to true will make it hard wrap at the column width.
     * default: false
     */
    hard?: boolean
    /**
     * By default, an attempt is made to split words at spaces, ensuring that they don't extend past the configured columns.
     * If wordWrap is false, each column will instead be completely filled splitting words as necessary.
     * default: true
     */
    wordWrap?: boolean
    /**
     * Whitespace on all lines is removed by default. Set this option to false if you don't want to trim.
     * default: true
     */
    trim?: boolean
}

export interface ColumnsOptions {
    columns?: string[]
    minWidth?: number
    maxWidth?: number
    align?: 'left' | 'right' | 'center'
    paddingChr?: string
    columnSplitter?: string
    preserveNewLines?: boolean
    showHeaders?: boolean
    dataTransform?: (data) => string
    truncate?: boolean
    truncateMarker?: string
    widths?: { [name: string]: ColumnsOptions }
    config?: { [name: string]: ColumnsOptions }
}


export interface OutputOptions {
    enabled?: boolean
    colors?: boolean
    inspect?: InspectOptions,
    stdout?: NodeJS.WriteStream
}


export interface OutputHelperOptionsConfigTableStyles {
    [name: string]: OutputHelperOptionsConfigTableStyle

    FAT?: OutputHelperOptionsConfigTableStyle
    SLIM?: OutputHelperOptionsConfigTableStyle
    NONE?: OutputHelperOptionsConfigTableStyle
}

export interface OutputHelperOptionsConfigTableStyle {
    [name: string]: string,

    'top'         ?: string,
    'top-mid'     ?: string,
    'top-left'    ?: string,
    'top-right'   ?: string,
    'bottom'      ?: string,
    'bottom-mid'  ?: string,
    'bottom-left' ?: string,
    'bottom-right'?: string,
    'left'        ?: string,
    'left-mid'    ?: string,
    'mid'         ?: string,
    'mid-mid'     ?: string,
    'right'       ?: string,
    'right-mid'   ?: string,
    'middle'      ?: string,
}

export interface OutputHelperOptionsConfig {
    quiet?: boolean,
    colors?: boolean,
    options?: {
        quiet?: boolean
        colors?: boolean
    },
    resetOnNewline?: boolean,
    styles?: { [name: string]: string },
    tableStyle?: OutputHelperOptionsConfigTableStyles
}


export interface Figures {
    tick: string
    cross: string
    star: string
    square: string
    squareSmall: string
    squareSmallFilled: string
    play: string
    circle: string
    circleFilled: string
    circleDotted: string
    circleDouble: string
    circleCircle: string
    circleCross: string
    circlePipe: string
    circleQuestionMark: string
    bullet: string
    dot: string
    line: string
    ellipsis: string
    pointer: string
    pointerSmall: string
    info: string
    warning: string
    hamburger: string
    smiley: string
    mustache: string
    heart: string
    arrowUp: string
    arrowDown: string
    arrowLeft: string
    arrowRight: string
    radioOn: string
    radioOff: string
    checkboxOn: string
    checkboxOff: string
    checkboxCircleOn: string
    checkboxCircleOff: string
    questionMarkPrefix: string
    oneHalf: string
    oneThird: string
    oneQuarter: string
    oneFifth: string
    oneSixth: string
    oneSeventh: string
    oneEighth: string
    oneNinth: string
    oneTenth: string
    twoThirds: string
    twoFifths: string
    threeQuarters: string
    threeFifths: string
    threeEighths: string
    fourFifths: string
    fiveSixths: string
    fiveEighths: string
    sevenEighths: string
}



export type List<T> = ArrayLike<T>;

export interface Dictionary<T> {
    [index: string]: T;
}

export interface NumericDictionary<T> {
    [index: number]: T;
}

export interface Cancelable {
    cancel(): void;

    flush(): void;
}


export interface IPrototypeableClass extends Function {
    readonly prototype: any;
    new (...args: any[]): any;
}

export type IPropertyKey = string | symbol | number;

export interface IMixiner {
    readonly prototype: any;
    (mixin: IPrototypeableClass): any;
    VERSION?: string;
    default?: IMixiner;
}

export namespace packageFile {
    export interface IPackageJSON extends Object {

        [key: string]: any

        readonly name: string;

        readonly version?: string;

        readonly description?: string;

        readonly keywords?: string[];

        readonly homepage?: string;

        readonly bugs?: string | IBugs;

        readonly license?: string;

        readonly author?: string | IAuthor;

        readonly contributors?: string[] | IAuthor[];

        readonly files?: string[];

        readonly main?: string;

        readonly bin?: string | IBinMap;

        readonly man?: string | string[];

        readonly directories?: IDirectories;

        readonly repository?: string | IRepository;

        readonly scripts?: IScriptsMap;

        readonly config?: IConfig;

        readonly dependencies?: IDependencyMap;

        readonly devDependencies?: IDependencyMap;

        readonly peerDependencies?: IDependencyMap;

        readonly optionalDependencies?: IDependencyMap;

        readonly bundledDependencies?: string[];

        readonly engines?: IEngines;

        readonly os?: string[];

        readonly cpu?: string[];

        readonly preferGlobal?: boolean;

        readonly private?: boolean;

        readonly publishConfig?: IPublishConfig;

    }


    /**
     * An author or contributor
     */
    export interface IAuthor {
        name: string;
        email?: string;
        homepage?: string;
    }

    /**
     * A map of exposed bin commands
     */
    export interface IBinMap {
        [commandName: string]: string;
    }

    /**
     * A bugs link
     */
    export interface IBugs {
        email: string;
        url: string;
    }

    export interface IConfig {
        name?: string;
        config?: Object;
    }

    /**
     * A map of dependencies
     */
    export interface IDependencyMap {
        [dependencyName: string]: string;
    }

    /**
     * CommonJS package structure
     */
    export interface IDirectories {
        lib?: string;
        bin?: string;
        man?: string;
        doc?: string;
        example?: string;
    }

    export interface IEngines {
        node?: string;
        npm?: string;
    }

    export interface IPublishConfig {
        registry?: string;
    }

    /**
     * A project repository
     */
    export interface IRepository {
        type: string;
        url: string;
    }

    export interface IScriptsMap {
        [scriptName: string]: string;
    }
}


export type IdeaBoolean = 'true' | 'false'

export interface BaseSourceFolder {
    url:string
}
export interface PackageSourceFolder extends BaseSourceFolder {
    isTestSource: IdeaBoolean
    packagePrefix: string
}
export interface ResourceSourceFolder extends BaseSourceFolder {
    type: string
    relativeOutputPath: string
}
export interface IdeaIml {
    module: {
        $: { type: string, version: string },
        component: Array<{
            '$': { 'name': string, 'inherit-compiler-output': IdeaBoolean },
            'exclude-output'?: any[],
            'content'?: Array<{
                '$': { 'url': string },
                'sourceFolder'?: Array<{
                    '$': Partial<PackageSourceFolder & ResourceSourceFolder>
                }>,
                'excludeFolder'?: Array<{ '$': { 'url': string } }>
            }>,
            'orderEntry'?: Array<{
                '$': {
                    'type'?: 'library' | 'sourceFolder' | 'inheritedJdk',
                    'name'?: string,
                    'level'?: 'project' | 'global' | 'scope',
                    'forTests'?: IdeaBoolean
                }
            }>
        }>
    }
}

export interface PhpXml {
    project: {
        $: { type: string, version: string },
        component: Array<{
            '$': { 'name': string, 'inherit-compiler-output': IdeaBoolean },
            'include_path'?: Array<{
                'path'?: Array<{ '$': { 'value': string } }>
            }>
        }>
    }
}


export interface Folders {
    resources?: ResourceSourceFolder[],
    sources?: PackageSourceFolder[]
    excludes?: string[]
}