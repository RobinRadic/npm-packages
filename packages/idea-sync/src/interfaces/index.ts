export * from './cache.interfaces';
export * from './composer.interfaces';
export * from './config.interfaces';

export interface IdeaSettingsBundleXmlFile {
    path: string
    xml: string
}

export interface ISettingConfig {
    name: string
    xmlFiles: IdeaSettingsBundleXmlFile[]
    globs: string[]
}
