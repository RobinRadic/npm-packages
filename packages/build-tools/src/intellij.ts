import { dirname, join, relative, resolve } from 'path';
import { objectExists, objectGet } from '@radic/util';
import { read, write } from './lib/utils';
import * as xml2js from 'xml2js';
import * as globule from 'globule'
import * as _ from 'lodash';

export type IdeaBoolean = 'true' | 'false'

export interface IdeaIml {
    module: {
        $: { type: string, version: string },
        component: Array<{
            '$': { 'name': string, 'inherit-compiler-output': IdeaBoolean },
            'exclude-output'?: any[],
            'content'?: Array<{
                '$': { 'url': string },
                'sourceFolder'?: Array<{
                    '$': { 'url': string, 'isTestSource'?: IdeaBoolean, packagePrefix?: string, type?: string, relativeOutputPath?: string }
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

export type SourceFolders = Array<{ name: string, dev: boolean, namespace: string, path: string }>
export type ResourceFolders = Array<{ path: string, relativeOutputPath: string }>

export function getPsr4FoldersFromComposerFiles(composerGlobs: string | string[] = 'composer.json'): SourceFolders {
    let dirs: SourceFolders = [] = []
    globule.find(composerGlobs).forEach(composerPath => {
        composerPath   = resolve(composerPath)
        const composer = require(composerPath);
        [ 'autoload', 'autoload-dev' ].forEach(type => {
            const dev = type.endsWith('dev')
            if ( objectExists(composer, type + '.psr-4') ) {
                const autoload = objectGet(composer, type + '.psr-4')
                Object.keys(autoload).forEach(namespace => {
                    dirs.push({ dev, namespace, name: composer.name, path: relative(process.cwd(), resolve(dirname(composerPath), autoload[ namespace ])) })
                })
            }
        })
    })
    return dirs;
}

//@formatter:off
export class XmlEdit {
    builder: xml2js.Builder
    constructor(public filePath: string, options: xml2js.OptionsV2 = {}) { this.builder = new xml2js.Builder(options) }
    write   = (xml: string, filePath?:string) => write(resolve(filePath || this.filePath), xml)
    build = (json) => this.builder.buildObject(json).replace('standalone="yes"', '')
}
export function xmlEdit<T>(filePath: string, customizer: (this: XmlEdit, json: T) => void, options: xml2js.OptionsV2 = {}): Promise<any> {
    filePath = resolve(filePath);
    return new Promise((resolve, reject) => {
        xml2js.parseString(read(filePath), (err, json) => {
            if ( err ) { return reject(err); } else { customizer.apply(new XmlEdit(filePath, options), [ json ]); }
            resolve();
        })
    })
}
//@formatter:on


export class Intellij {
    static getProjectIMLPath = (): string => globule.find(resolve(process.cwd(),'.idea', '*.iml'))[ 0 ]

    static markFoldersUsingComposerFiles(composerGlobs: string | string[]): Promise<any> {
        let dirs = getPsr4FoldersFromComposerFiles(composerGlobs);

        return xmlEdit<IdeaIml>(Intellij.getProjectIMLPath(), function (json) {
            const url                     = (...parts: any[]) => 'file://' + join(...[ '$MODULE_DIR$' ].concat(parts))
            let cid                       = _.findIndex(json.module.component, (component) => component.$.name === 'NewModuleRootManager');
            const content                 = json.module.component[ cid ].content[ 0 ];
            content.excludeFolder         = content.excludeFolder || []
            content.sourceFolder          = content.sourceFolder || []
            const sourceFolders: string[] = content.sourceFolder.map(sf => sf.$.url)
            dirs.forEach(dir => {
                if ( ! sourceFolders.includes(url(dir.path)) ) {
                    content.sourceFolder.push({ $: { url: url(dir.path), isTestSource: dir.dev ? 'true' : 'false', packagePrefix: dir.namespace } })
                }
            })
            this.write(this.build(json));
        })
    }

    static markResourceFolders(resources: ResourceFolders) : Promise<any>{
        return xmlEdit<IdeaIml>(Intellij.getProjectIMLPath(), function (json) {
            const url                     = (...parts: any[]) => 'file://' + join(...[ '$MODULE_DIR$' ].concat(parts))
            let cid                       = _.findIndex(json.module.component, (component) => component.$.name === 'NewModuleRootManager');
            const content                 = json.module.component[ cid ].content[ 0 ];
            content.excludeFolder         = content.excludeFolder || []
            content.sourceFolder          = content.sourceFolder || []
            const sourceFolders: string[] = content.sourceFolder.map(sf => sf.$.url)
            resources.forEach(res => {
                if ( ! sourceFolders.includes(url(res.path)) ) {
                    content.sourceFolder.push({ $: { url: url(res.path), type: 'java-resource', relativeOutputPath: res.relativeOutputPath } })
                }
            })
            this.write(this.build(json));
        })
    }

    static removeSymlinkedVendorEntriesFromPhpXml(composerGlobs: string | string[]): Promise<any> {
        let packageNames = globule
            .find(composerGlobs)
            .map(composerPath => require(resolve(composerPath)).name)

        return xmlEdit<PhpXml>(resolve(process.cwd(),'.idea/php.xml'), function (json) {
            const value                                          = (...parts: any[]) => join(...[ '$PROJECT_DIR$' ].concat(parts))
            let cid                                              = _.findIndex(json.project.component, (component) => component.$.name === 'PhpIncludePathManager');
            const path                                           = json.project.component[ cid ].include_path[ 0 ].path;
            json.project.component[ cid ].include_path[ 0 ].path = path.filter((p) => {
                let packageName = p.$.value.split('/').reverse().slice(0, 2).reverse().join('/')
                return packageNames.includes(packageName) === false;
            })
            this.write(this.build(json));
        })
    }
}