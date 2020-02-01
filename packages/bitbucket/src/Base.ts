import { Command } from '@oclif/command';
import  { AuthBasic } from 'bitbucket';
import { merge } from 'lodash';
import { cli } from 'cli-ux';
import { password, token, username } from './flags';
import { Settings } from './utils/Settings';
import { getSettings, ISettings } from './settings';
import Github from '@octokit/rest'
import { Packagist } from './Packagist';
import { execSync } from "child_process";
import { RemoteRepos } from './commands/repo/copy';
import { inspect } from 'util';
import { Bitbucket } from './Bitbucket';
import 'tty'

export default interface Base {
    constructor: typeof Base
}
export default abstract class Base extends Command {
    public readonly prompt: typeof cli.prompt = cli.prompt
    protected settings: Settings<ISettings> & ISettings;
    protected bitbucket: Bitbucket
    protected github: Github
    protected packagist: Packagist
    protected skipAuth: boolean               = false;
    protected interactive:boolean=true

    protected dump(...args){
        this.log(inspect(args, {showHidden:true, depth:10, colors:true}))
        return this
    }


    protected init(): Promise<any> {
        this.constructor.flags          = this.constructor.flags || {}
        this.constructor.flags.username = username()
        this.constructor.flags.password = password()
        this.constructor.flags.token    = token()
        return super.init();
    }

    protected didSetup = false

    async setup(): Promise<Bitbucket> {
        if ( this.didSetup ) {
            return
        }
        this.didSetup  = true;
        this.interactive=process.stdin.isTTY===true
        this.settings  = getSettings()
        this.packagist = new Packagist({
            throwErrors: false,
            username   : this.settings.packagist.username,
            token      : this.settings.packagist.token,
            url        : this.settings.packagist.url,
        })
        this.bitbucket = new Bitbucket(merge({
            hideNotice: true,
        }, this.settings.bitbucket.connection))
        this.github    = new Github({
            auth: `token ${this.settings.github.token}`,
        })
        if ( ! this.skipAuth ) {
            this.bitbucket.authenticate({
                type    : 'basic',
                username: this.settings.bitbucket.username,
                password: this.settings.bitbucket.password,
            } as AuthBasic);
        }
        return this.bitbucket
    }

    createExec(cwd) {
        return (command, log = true) => {
            if ( log ) {
                this.log(command)
            }
            execSync(command, { encoding: 'utf8', cwd });
        }
    }
}
