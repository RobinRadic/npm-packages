declare module 'columnify' {
    function columnify(data: columnify.Data, options: columnify.Options): string

    namespace columnify {

        export interface Options {
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
            widths?: { [ name: string ]: Options }
            config?: { [ name: string ]: Options }
        }

        export type Data = object | object[]


    }

    export = columnify
}
declare module 'tty-table' {

    const ttytable: ttytable.Factory; //(header: ttytable.HeaderOptions, rows: any[], options?: ttytable.Options): ttytable.Table
    // declare function ttytable(header: ttytable.HeaderOptions, rows: any[], options?: ttytable.Options): ttytable.Table

    namespace ttytable {

        export type Factory = (header: HeaderOptions, rows: any[], options?: Options) => Table

        export interface TableConstructor {
            new(header: HeaderOptions, rows: any[], options?: Options): Table;

            prototype: Table
        }

        export interface Table {
            constructor: TableConstructor

            render(): string
        }

        export type Align = 'center' | 'left' | 'right'

        export interface ColumnOptions {
            alias?: string
            align?: Align
            color?: string
            footerAlign?: Align
            footerColor?: string
            formatter?: (val: any) => string
            headerAlign?: Align
            headerColor?: string
            marginLeft?: number
            marginTop?: number
            width?: string | number
            paddingBottom?: number
            paddingLeft?: number
            paddingRight?: number
            paddingTop?: number
        }

        export type HeaderOptions = Array<ColumnOptions>

        export interface Options {
            borderStyle?: number
            borderColor?: string
            compact?: boolean
            defaultErrorValue?: any
            defaultValue?: any
            errorOnNull?: boolean
            truncate?: false | string
        }
    }

    export = ttytable
}
