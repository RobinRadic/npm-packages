import { flags } from '@oclif/command';
import Base from '../Base';
import glob from 'glob'
import {homedir} from 'os'
import { join } from 'path';
import { chain } from 'lodash'

export default class LinkCommand extends Base {
    // static description = 'describe the command here';
    static flags = { help : flags.help({ char: 'h' }),};
    static args = [ { name: 'file' } ];

    async run() {
        await this.setup();
        let globs = [
            '*','*/*'
        ]

        let paths = chain( ['.*','.*/*'])
            .map(glob => join(homedir(), glob,'config/options/options.xml'))
            .each(path => console.log(path))
            .map(path => glob.sync(path,{strict:false,silent:true,dot:true,ignore:['**/.cache/**']}))
            .flatten()
            .uniq()
            .value();

        console.dir(paths)
    }
}
