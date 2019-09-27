import { flags } from '@oclif/command';
import Base from '../Base';

export default class ListCommand extends Base {
    static description = 'describe the command here';

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
        await this.setup();
        console.dir('list')
    }
}
