import "./yargs-parser";
import {Question as BaseQuestion} from "inquirer";
import { HelperOptionsConfig } from '@radic/console';


declare module "@radic/console" {


    interface HelpersOptionsConfig {
        'ssh.bash': HelperOptionsConfig
        'connect': HelperOptionsConfig
    }

}

declare namespace global {
    export interface CliTable extends Array<string[]> {

    }
    export interface Question extends BaseQuestion {
        source?: (answers:any, input:any) => Promise<string[]>
    }
}

// Common interface between Arrays and jQuery objects
interface List<T> {
    [index: number]: T;
    length: number;
}

interface Dictionary<T> {
    [index: string]: T;
}

interface NumericDictionary<T> {
    [index: number]: T;
}

interface StringRepresentable {
    toString(): string;
}

interface Cancelable {
    cancel(): void;
    flush(): void;
}

import { GotOptions } from 'got';


type DownloadOptions = GotOptions<string> & {
    extract?: boolean
    filename?: string
    proxy?: string
};

declare function download(url: string, destination: string, options?: DownloadOptions): Promise<Buffer>
declare function download(url: string, options?: DownloadOptions): Promise<Buffer>

declare module 'download' {
    export = download
}