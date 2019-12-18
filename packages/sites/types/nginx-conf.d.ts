
declare module 'nginx-conf' {
    import { EventEmitter } from "events";

    export interface TreeNode {
        name: string
        value: string
        parent: TreeNode | null
        children: TreeNode[]
        comments: string[]
        isVerbatim: boolean
    }

    export type ParserCallback = (error: Error, tree?: TreeNode) => any

    export class NginxParser {
        source: string;
        index: number;
        tree    ?: any;
        context ?: any;
        error   ?: any;

        parse(source: string, callback: ParserCallback): void

        parseNext(): void

        readString(): string

        setError(message: string): void

        readWord(): string

        readComment(): string

        readVerbatimBlock(): string

        parseFile(file: string, encoding: string, callback: ParserCallback): void
    }


    export interface ConfItem {
        [ key: string ]: ConfItem | any

        _remove(name: string, index?: number)

        _add(name: string, value: any, children?: any[], comments?: any[], options?: any)

        _addVerbatimBlock(name: string, value: any, comments?: any[])

        _getString(depth)

        toString(): string

        _value: string
        _isVerbatim: boolean
        _name: string
        _comments: string[]
    }

    // export interface NginxConfFile extends EventEmitter {}
    export interface NginxConfFileInstance extends EventEmitter {
        nginx:ConfItem

        /** write to another file */
        live(path: string)

        /** don't write to disk when something changes */
        die(path: string)

        /**  force the synchronization */
        flush()

        write(callback: Function)
    }
    export interface NginxConfFileStatic {
        prototype:NginxConfFileInstance
        new(...params):NginxConfFileInstance

         create(path: string, callback: (err, conf: NginxConfFileInstance) => any)
         create(path: string, options: any, callback: (err, conf: NginxConfFileInstance) => any)

         createFromSource(source: string, callback: (err, conf: NginxConfFileInstance) => any)
         createFromSource(source: string, options: any, callback: (err, conf: NginxConfFileInstance) => any)

    }

    export const NginxConfFile:NginxConfFileStatic


}
