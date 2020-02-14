import glob from 'glob'
import { homedir } from 'os';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs'
import * as inquirer from 'inquirer';
import { rm } from 'shelljs';

export class ResetEvals {
    enableLogger: boolean           = true
    selectDirsGlob: string          = resolve(homedir(), '.*/config/port.lock')
    removeJavaUserPrefsGlob: string = resolve(homedir(), '.java/.userPrefs')

    log(message?: any, ...optionalParams: any[]) {
        if ( ! this.enableLogger ) return this;
        console.log(message, ...optionalParams)
        return this;
    }

    async selectDirs(cb: (paths: string[]) => void = () => null) {
        let files   = glob.sync(this.selectDirsGlob).map(filePath => dirname(filePath));
        let answers = await inquirer.prompt<{ paths: string[] }>([
            { name: 'paths', type: 'checkbox', choices: files }
        ]);

        if ( typeof cb === 'function' ) cb(answers.paths)
        return answers.paths;
    }

    resetEval(path: string) {
        this.log('Resetting eval for: ', path)
        if ( existsSync(resolve(path, 'eval')) ) {
            rm('-r', resolve(path, 'eval'))
            this.log('removed eval dir')
        }
        let filePaths = ['options/options.xml','options/other.xml'];
        filePaths.forEach(filePath => {
            filePath = resolve(path, filePath);
            if ( existsSync(filePath) ) {
                let content = readFileSync(filePath, 'utf8');
                content     = content.replace(/.*evlsprt.*\n/g, '');
                writeFileSync(filePath, content, 'utf8');
                this.log('cleaned ' + filePath)
            }
        })
    }

    removeJavaUserPrefs() {
        let path = this.removeJavaUserPrefsGlob;
        if ( existsSync(path) ) {
            rm('-r', path);
            this.log('removed java user prefs')
        }
    }
}
