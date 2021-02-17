import { BaseNginxCommand }                                     from '../BaseNginxCommand';
import { Input }                                                from '../Input';
import { Paths }                                                from '../../Paths';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve }                                              from 'path';
import { out }                    from '../Output';
import { openNginxConfig, shell } from '../../utils';

export default class CreateCommand extends BaseNginxCommand {
    static description = 'Create a site';


    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        const types = ['nginx','apache','nginx-apache'];
        const type = await Input.list('Type', types);

        const templates          = readdirSync(Paths.package('templates'));
        const template           = Paths.package('templates', await Input.list('Choose base template', templates));
        const serverName: string = await Input.input('Server name');
        const rootDir            = Paths.cwd(await Input.directoryTree('Root directory'));
        const logDir             = Paths.cwd(await Input.directoryTree('Log directory'));
        const configFilePath     = resolve('/etc/nginx/sites-available', serverName + '.conf');

        if ( existsSync(configFilePath) ) {
            return this.error(`Can not add ${serverName}. Config file already exists [${configFilePath}]`);
        }

        await this.checkHostfile(serverName);

        writeFileSync(configFilePath, readFileSync(template, 'utf8'), 'utf8');

        const conf                           = await openNginxConfig(configFilePath);
        conf.nginx.server.server_name._value = serverName;
        conf.nginx.server.root._value        = rootDir;
        conf.nginx.server.error_log._value   = resolve(logDir, 'error.log');
        conf.nginx.server.access_log._value  = resolve(logDir, 'access.log');
        conf.flush();

        out.success('Site created, you can now enable it');


        if ( await Input.confirm('Create MySQL database?', true) ) {
            let databaseName = await Input.input('Database name?', serverName.split('.')[ 0 ]);
            await shell('mysql -u root -p\'test\' -e "create database `' + databaseName + '`";')
            out.success(`Database "${databaseName}" created`)
        }

        // console.log(conf.nginx.toString());
        // console.dir({ template, serverName, documentRootDir: rootDir, logDir, configFilePath });
        // this.restartServices();
    }

    async checkHostfile(serverName: string) {
        let hosts     = readFileSync('/etc/hosts', 'utf8');
        const hasHost = hosts.includes(serverName);
        if ( hasHost === false && await Input.confirm('Add to host file?', true) ) {
            writeFileSync('/etc/hosts', `${hosts}\n127.0.0.1 ${serverName}`, 'utf8');
            out.success('Added site to host file');
        }
    }
}
