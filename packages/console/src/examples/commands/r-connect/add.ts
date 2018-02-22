import { HelpHelperOptionsConfig ,command, CommandArguments, Config, InputHelper, lazyInject, Log, option, OutputHelper } from "../../../";

@command(`add|1
{name:string@the connection name} 
{host:string@the host to connect}
[user/users:string[]@the user to login] 
[method:string[]@the connect method]`, {
    description: 'Add a connection',
    helpers    : {
        help: <HelpHelperOptionsConfig> {
            headers: {
                description: ''
            },
            overrides: {
                 description: (command, describer, helper) => { describer.line(`{header}${command.description}{/header}`).nl; }
            },
            order: [
                'description',
                'usage',
                'explanation',
                'groups',
                'commands',
                'arguments',
                'options',
                'globalOptions',
                'example'
            ]
        }
    },
})
export class RcliConnectAddCmd {

    @lazyInject('cli.helpers.output')
    out: OutputHelper;

    @lazyInject('cli.helpers.input')
    ask: InputHelper;

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config

    @option('P', 'login using a password')
    pass: string

    @option('p', 'use the given port ')
    port: number = 22

    @option('l', 'local mount path for sshfs ')
    localPath: string = '/mnt/<name>'


    handle(args: CommandArguments, ...argv: any[]) {
        let add = {
            name     : args.name,
            user     : args.user,
            host     : args.host,
            method   : 'key',
            port     : this.port,
            localPath: '/mnt/' + args.name,
            hostPath : '/'
        }

        // this.out.dump(this);
        // this.log.info('config', this.config)
        this.out.dump(this.config.get(''));
        // this.out.dump(this.config);
        // this.log.info('Im in RcliConnectCmmand. Njou')

    }

}
export default RcliConnectAddCmd