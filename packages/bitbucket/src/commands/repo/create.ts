import Base from '../../Base';
import { IArg } from '@oclif/parser/lib/args';
import { Input } from '@oclif/command/lib/flags';
import { flags } from '@oclif/command';


export default class RepoCreate extends Base {
    static description = 'Create a repository';

    static flags: Input<any> = {
        private: flags.boolean({ char: 'P', description: 'Create a private repository' }),
    }
    static args: IArg[]      = [
        { name: 'full_name' },
    ]

    async run() {
        const bb              = await this.setup();
        const { args, flags } = this.parse(this.constructor);
        // if(!args.full_name){ this.prompt }
        bb.repositories.create({
            username:'mylink',
            repo_slug:'crvsbe'
        })
        const name = flags.name || 'world';
        this.log(`hello ${name} from ./src/commands/hello.ts`);
        if ( args.file && flags.force ) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
