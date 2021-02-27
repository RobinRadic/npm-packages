import { BaseCommand, findPhpBinaries, getPhpBinaryData, whatis } from '../lib';
import { execSync }                                               from 'child_process';

export default class TesterCommand extends BaseCommand {
    static description = 'Restart the services';

    async run() {
        let phpBinaries = findPhpBinaries();
        let phpVersions = phpBinaries.map(path => getPhpBinaryData(path))
        phpVersions.forEach(version => {
            this.out.line(` - ${version.version}`);
        })
        return;
    }
}

