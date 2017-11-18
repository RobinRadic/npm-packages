import { PrepareArgumentsFunction, command, CommandArguments, CommandConfig, Dispatcher, inject, InputHelper, LoggerInstance, option, OutputHelper } from "@radic/console";
import { RConfig } from "../../";
import { ConnectHelper } from "../../helpers/helper.connect";
import { IGitService } from "../../services/service.git";

@command(`packagist|p
{url:string@This should be the url to your packagist web installation.}
[path:string@A path that is either a Git repository, or a path containing multiple folders with a git repository. If not provided, will use the current directory (CWD)]
`, {
    description: 'Adds 1 or more git repositories to a packagist host',
    explanation: `{bold}Problem{/bold}: 
- You have a folder that contains a lot of sub-folders. 
- Each of those sub-folders is a git repository.
- Each of those sub-folders is a composer package.
- These should all be added to your (personal!) packagist web installation

{bold}Problem example{/bold}
- my-projects   {grey}(folder){/grey}
    - awesome-a     {grey}(folder){/grey}
        - .git          (origin: {cyan}https://bitbucket.org/{/cyan})
        - composer.json (name:   {cyan}awesome/a{/cyan})
    - awesome-b     {grey}(folder){/grey}
        - .git          (origin: {cyan}https://bitbucket.priviate.org/AWESOME/b{/cyan})
        - composer.json (name:   {cyan}awesome/b{/cyan})
    - foo-f         {grey}(folder){/grey}
        - .git          (origin: {cyan}https://github.com/foo/f{/cyan})
        - composer.json (name:   {cyan}foo/fighters{/cyan})
    - etc..
    
    
{bold}This is a tedious task because{/bold}
- You want the remote git repository to have a webhook to your peronsal packagist installation (auto-update)
- You would have to assign this webhook for each git remote (be it github, bitbucket cloud, bitbucket server, etc)
- You need to add them one at a time into your packagist installation 


{bold}Solution{/bold}
Use ME!
You can use this tool DIRECTLY in 1 git repository. Simple 1 package upload (as in the example, inside the {bold}awesome-a{/bold} directory)
You can also use this tool to batch multiple git repositories. Just execute this in the parent directories. (as example shows; {bold}my-projects{/bold} directory.

When batching, it will search all underlying directories for {italic}.git{/italic} directories.
It will use the {bold}origin{/bold} remote! so be aware of that.
    `
})
export class GitPackagistCmd {
    showHelp: () => void

    @inject('cli.helpers.output')
    out: OutputHelper;

    @inject('cli.helpers.input')
    ask: InputHelper;

    @inject('cli.helpers.connect')
    connect: ConnectHelper

    @inject('r.log')
    log: LoggerInstance;

    @inject('r.config')
    config: RConfig

    @inject('cli.events')
    events: Dispatcher;

    @option('o', 'options', { type: 'object', default: {} })
    options: any

    async handle(args: CommandArguments, ...argv: any[]) {
        if(!await this.ask.confirm('You have created a backup of everything in this folder? Though it should all be okay, mishaps DO happen.', 'n')){
            this.log.notice('Action canceled.')
        }

    }


}

export default GitPackagistCmd