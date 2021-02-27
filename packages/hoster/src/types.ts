import { IConfig } from '@oclif/config';

declare module '@oclif/config' {
    export interface IConfig {
        phpPath?: string
        apache2Path?: string
        nginxPath?: string
        linkDir?: string
    }
}

export interface IEngine {

}
