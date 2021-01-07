import { BaseCommand }                                                 from '../lib';
import { existsSync, mkdirSync, readdirSync, symlinkSync, unlinkSync } from 'fs';

export default class LinkCommand extends BaseCommand {
    static description = 'Link sites';

    async run() {
        if ( !existsSync(this.paths.linkDir()) ) {
            mkdirSync(this.paths.linkDir());
        }
        for ( const item of readdirSync(this.paths.php(), { withFileTypes: true }) ) {
            if ( !item.isDirectory() ) {
                continue;
            }
            let version = parseInt(item.name.replace('.', ''));
            if ( version < 70 || version > 100 ) {
                continue;        // symlinkSync('/etc/php/7.2', Paths.cwd('sites/php72'));

            }
            let dirPath = this.paths.linkDir('php' + version.toString());
            this.ensureSymlink(this.paths.php(item.name), dirPath);
        }

        this.ensureSymlink(this.paths.nginx(), this.paths.linkDir('nginx'));
        this.ensureSymlink(this.paths.apache2(), this.paths.linkDir('apache2'));


        this.out.success('Sites linked in local directory "./sites"');
    }

    ensureSymlink(fromPath, toPath) {
        try {
            if ( existsSync(toPath) ) {
                unlinkSync(toPath);
            }
            symlinkSync(fromPath, toPath);
            this.out.success(`Symlinked '${fromPath}' -> '${toPath}'`);
        } catch ( e ) {
            this.out.error(`Something went wrong symlinking '${fromPath}' -> '${toPath}' : ${e.message ?? e}`);
        }

    }
}
