import { BaseCommand, findPhpBinaries, getPhpBinaryData } from '../lib';
import { execSync }                                       from 'child_process';
import ini                                                from 'ini'
import { readFileSync }                                   from 'fs';
import { getPhpConfigurationData }                        from '../lib/php';
export default class TestCommand extends BaseCommand {
    static description = 'Restart the services';

    async run() {
        let binaries = findPhpBinaries();

        getPhpConfigurationData(binaries[0])
        let phps = binaries.map(path => getPhpBinaryData(path));
        phps.forEach(php => {
            console.log(php.semver);
            this.out.line(` - ${php.semver.major}`);
        });
        return;
    }
}

