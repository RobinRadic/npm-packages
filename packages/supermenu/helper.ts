import superagent from 'superagent';
import Zip from 'adm-zip';
import { createWriteStream, renameSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { removeSync, emptyDirSync } from 'fs-extra';

const log = console.log.bind(console);


const zipFilePath       = resolve(__dirname, '.zepto.zip');
const zeptoDownloadPath = resolve(__dirname, 'node_modules/zepto-master');
const zeptoPath         = resolve(__dirname, 'node_modules/zepto');

function zepto(cb?) {
    if ( existsSync(zeptoDownloadPath) ) {
        emptyDirSync(zeptoDownloadPath);
        removeSync(zeptoDownloadPath);
    }
    if ( existsSync(zeptoPath) ) {
        emptyDirSync(zeptoPath);
        removeSync(zeptoPath);
    }
    superagent
        .get('https://github.com/madrobby/zepto/archive/master.zip')
        .pipe(createWriteStream(zipFilePath))
        .on('finish', () => {
            const zip = new Zip(zipFilePath);
            zip.extractEntryTo('zepto-master/', resolve(__dirname, 'node_modules'), true, true);
            renameSync(resolve(__dirname, 'node_modules/zepto-master'), zeptoPath);
            log('downloaded zip to', zipFilePath);
            execSync(`yarn && yarn dist`, {
                cwd     : zeptoPath,
                encoding: 'utf8',
                stdio: 'inherit',
                env: {
                    ...process.env,
                    'MODULES': 'zepto event form ie',
                },
            });
            log('downloaded zip to', zipFilePath);
            if ( existsSync(zipFilePath) ) {
                removeSync(zipFilePath);
                log('removed zip from', zipFilePath);
            }
            if ( typeof cb === 'function' ) {
                cb(zeptoPath);
            }
        });
}

if ( process.argv.includes('zepto') ) {
    zepto();
}
