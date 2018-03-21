import { dirname, relative, resolve } from 'path';
import { objectExists, objectGet } from '@radic/util';
import { read, write } from './lib/utils';
import * as xml2js from 'xml2js';
import * as globule from 'globule'


type SourceFolders = Array<{ name: string, dev: boolean, namespace: string, path: string }>

function getSourceFolders(): SourceFolders {
    let dirs: SourceFolders = [] = []
    globule.find([ 'composer.json', '{addons,core}/**/*/composer.json' ]).forEach(composerPath => {
        composerPath   = resolve(composerPath)
        const composer = require(composerPath);
        [ 'autoload', 'autoload-dev' ].forEach(type => {
            const dev = type.endsWith('dev')
            if ( objectExists(composer, type + '.psr-4') ) {
                const autoload = objectGet(composer, type + '.psr-4')
                Object.keys(autoload).forEach(namespace => {
                    dirs.push({ dev, namespace, name: composer.name, path: relative(__dirname, resolve(dirname(composerPath), autoload[ namespace ])) })
                })
            }
        })
    })
    return dirs;
}

//@formatter:off
class XmlEdit {
    builder: xml2js.Builder
    constructor(public filePath: string, options: xml2js.OptionsV2 = {}) { this.builder = new xml2js.Builder(options) }
    write   = (xml: string, filePath?:string) => write(resolve(filePath || this.filePath), xml)
    build = (json) => this.builder.buildObject(json).replace('standalone="yes"', '')
}
function xmlEdit<T>(filePath: string, customizer: (this: XmlEdit, json: T) => void, options: xml2js.OptionsV2 = {}): Promise<any> {
    filePath = resolve(filePath);
    return new Promise((resolve, reject) => {
        xml2js.parseString(read(filePath), (err, json) => {
            if ( err ) { return reject(err); } else { customizer.apply(new XmlEdit(filePath, options), [ json ]); }
            resolve();
        })
    })
}
//@formatter:on

