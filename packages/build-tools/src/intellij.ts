import { dirname, join, relative, resolve } from 'path';
import { objectExists, objectGet } from '@radic/util';
import { read, write } from './lib/utils';
import * as xml2js from 'xml2js';
import * as globule from 'globule'
import * as _ from 'lodash';
// import { Folders, IdeaIml, PackageSourceFolder, PhpXml, ResourceSourceFolder } from './lib/interfaces';
//
// export { Folders, IdeaIml, PackageSourceFolder, PhpXml, ResourceSourceFolder }

export function getPsr4FoldersFromComposerFiles(composerGlobs: string | string[] = 'composer.json'): PackageSourceFolder[] {
    let dirs: PackageSourceFolder[] = []

    globule.find(composerGlobs).forEach(composerPath => {
        composerPath   = resolve(composerPath)
        const composer = require(composerPath);
        [ 'autoload', 'autoload-dev' ].forEach(type => {
            if ( objectExists(composer, type + '.psr-4') ) {
                const autoload = objectGet(composer, type + '.psr-4')
                Object.keys(autoload).forEach(namespace => {
                    dirs.push({
                        isTestSource : type.endsWith('dev') ? 'true' : 'false',
                        packagePrefix: namespace,
                        url          : relative(process.cwd(), resolve(dirname(composerPath), autoload[ namespace ]))
                    })
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

const helpers = {
    phpXml: {
        includePaths: (customizer: (paths: PhpXmlIncludePathPath[], toValue: (...parts: any[]) => string) => PhpXmlIncludePathPath[]) => {
            return xmlEdit<PhpXml>(resolve(process.cwd(), '.idea/php.xml'), function (json) {
                const value = (...parts: any[]) => join(...[ '$PROJECT_DIR$' ].concat(parts));

                let cid                                              = _.findIndex(json.project.component, (component) => component.$.name === 'PhpIncludePathManager');
                json.project.component[ cid ].include_path[ 0 ].path = customizer(json.project.component[ cid ].include_path[ 0 ].path, value);

                this.write(this.build(json));

            })
        }
    }
}

export class Intellij {
    static getProjectIMLPath = (): string => globule.find(resolve(process.cwd(), '.idea', '*.iml'))[ 0 ]
    static url               = (str: string) => str.startsWith('file://') ? str : 'file://' + join('$MODULE_DIR$', str);

    static markFolders(markFolders: Folders): Promise<any> {
        return xmlEdit<IdeaIml>(Intellij.getProjectIMLPath(), function (json) {

            let cid                        = _.findIndex(json.module.component, (component) => component.$.name === 'NewModuleRootManager');
            const content                  = json.module.component[ cid ].content[ 0 ];
            content.excludeFolder          = content.excludeFolder || []
            content.sourceFolder           = content.sourceFolder || []
            const sourceFolders: string[]  = content.sourceFolder.map(sf => sf.$.url)
            const excludeFolders: string[] = content.excludeFolder.map(sf => sf.$.url)

            if ( markFolders.resources && Array.isArray(markFolders.resources) ) {
                markFolders.resources.forEach(markResourceFolder => {
                    if ( ! sourceFolders.includes(Intellij.url(markResourceFolder.url)) ) {
                        content.sourceFolder.push({
                            $: {
                                url               : Intellij.url(markResourceFolder.url),
                                type              : 'java-resource',
                                relativeOutputPath: markResourceFolder.relativeOutputPath
                            }
                        })
                    }
                })
            }
            if ( markFolders.sources && Array.isArray(markFolders.sources) ) {
                markFolders.sources.forEach(markSourceFolder => {
                    if ( ! sourceFolders.includes(Intellij.url(markSourceFolder.url)) ) {
                        content.sourceFolder.push({
                            $: {
                                url          : Intellij.url(markSourceFolder.url),
                                isTestSource : markSourceFolder.isTestSource, //typeof markSourceFolder.isTestSource === 'string' ? markSourceFolder.isTestSource : markSourceFolder.isTestSource === true ? 'true' : 'false',
                                packagePrefix: markSourceFolder.packagePrefix
                            }
                        })
                    }
                })
            }
            if ( markFolders.excludes && Array.isArray(markFolders.excludes) ) {
                markFolders.excludes.forEach(markFolder => {
                    if ( ! excludeFolders.includes(Intellij.url(markFolder)) ) {
                        content.excludeFolder.push({ $: { url: Intellij.url(markFolder) } })
                    }
                })
            }
            this.write(this.build(json));
        })
    }

    static removePhpXmlSymlinkedVendorIncludePaths(composerGlobs: string | string[]): Promise<any> {
        let packageNames = globule
            .find(composerGlobs)
            .map(composerPath => require(resolve(composerPath)).name)

        return helpers.phpXml.includePaths((paths, value) => {
            return paths.filter((p) => {
                let packageName = p.$.value.split('/').reverse().slice(0, 2).reverse().join('/')
                return packageNames.includes(packageName) === false;
            })
        })
    }

    /**
     *
     * @param {string[]} addPaths An array of relative paths to add to the include paths
     * @returns {Promise<any>}
     */
    static addPhpXmlIncludePaths(addPaths: string[]): Promise<any> {
        return helpers.phpXml.includePaths((currentPaths: PhpXmlIncludePathPath[], value) => {
            let currentPathValues = currentPaths.map(path => path.$.value); // gets the string paths value from the object so we can compare it
            addPaths              = addPaths
                .map(path => value(path)) // transforms addPaths to $PROJECT_ROOT$/${path}
                .filter(path => currentPathValues.includes(path) === false) // filter out the path we want to add but are already already defined in currentPaths to avoid duplicates

            // add the new paths to the current paths
            addPaths.forEach(addPath => {
                currentPaths.push({ $: { value: addPath } })
            })

            // and return the modified result
            return currentPaths
        })
    }

    /** @deprecated */
    static markFoldersUsingComposerFiles(composerGlobs: string | string[]): Promise<any> {
        return Intellij.markFolders({ sources: getPsr4FoldersFromComposerFiles(composerGlobs) });
    }

    /** @deprecated */
    static markResourceFolders(markResourceFolders: ResourceSourceFolder[]): Promise<any> {
        return Intellij.markFolders({ resources: markResourceFolders })
    }
}


export type IdeaBoolean = 'true' | 'false'

export interface BaseSourceFolder {
    url: string
}

export interface PackageSourceFolder extends BaseSourceFolder {
    isTestSource: IdeaBoolean
    packagePrefix: string
}

export interface ResourceSourceFolder extends BaseSourceFolder {
    type: string
    relativeOutputPath: string
}

export interface Folders {
    resources?: Partial<ResourceSourceFolder>[],
    sources?: PackageSourceFolder[]
    excludes?: string[]
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

export type PhpXmlIncludePathPath = { '$': { 'value': string } }
export type PhpXmlIncludePath = { 'path'?: PhpXmlIncludePathPath[] }

export interface PhpXml {
    project: {
        $: { type: string, version: string },
        component: Array<{
            '$': { 'name': string, 'inherit-compiler-output': IdeaBoolean },
            'include_path'?: PhpXmlIncludePath[]
        }>
    }
}
