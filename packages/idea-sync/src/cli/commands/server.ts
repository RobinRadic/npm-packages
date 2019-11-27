import { flags } from '@oclif/command';
import Help from '@oclif/plugin-help';
import Base from '../Base';
import { IPlugin, Plugin } from '@oclif/config';

export default class ServerCommand extends Base {
    static description = 'Server commands';

    static examples = [
        `$ bb hello
hello world from ./src/hello.ts!
`,
    ];

    static flags = {
        help : flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        name : flags.string({ char: 'n', description: 'name to print' }),
        // flag with no value (-f, --force)
        force: flags.boolean({ char: 'f' }),
    };

    static args = [ { name: 'file' } ];

    async run() {
const help:IPlugin=await this.config.plugins.find(p => p.name === '@oclif/plugin-help');
console.log(help.topics);
new Help({},{})
        this._help()
        await this.setup();
        console.dir('list')
    }
}
