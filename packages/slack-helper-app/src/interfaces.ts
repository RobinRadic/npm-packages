import { AppOptions as SlackOptions } from '@slack/bolt';
import { Options as ConfOptions }     from 'conf';
import { Application }                from './core/Application';

export { SlackOptions, ConfOptions };

export interface ApplicationOptions {
    slack?: SlackOptions
    port: number
    conf?: ConfOptions<Config>
    extensions?: ExtensionConstructor[]
}

export interface Config {

}

export interface ExtensionOptions {}

export type VarArgConstructor<T = any> = {
    prototype?: T
    new(...args: any[]): T
}
export type ArgConstructor<T = any, A = any> = {
    prototype?: T
    new(args: A): T
}
export type ExtensionConstructor = ArgConstructor<Extension, Application>

export interface Extension {
    app: Application

    init?: () => Promise<any> | any
    start?: () => Promise<any> | any
}
