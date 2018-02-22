import {OutputHelper, command, CommandArguments, CommandConfig, Config, lazyInject, Log, OptionConfig } from "../../";

@command('connect|3 [command]', 'SSH connection helper', <CommandConfig> {
isGroup: true,
    helpers: {
        help: {
            app: { title: 'SSH Connection Helper'}
        }
    }
})
export class RcliConnectCmd {
    showHelp: () => void
    _config: CommandConfig
    _options: OptionConfig[]

    @lazyInject('cli.helpers.output')
    out: OutputHelper;

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config;

    handle(args:CommandArguments, argv: any[]) {
        this.showHelp()
        this.out.line('alright')

        let msg = 'log level: ' + this.log.level
        this.log.error(msg)
        this.log.warn(msg)
        this.log.alert(msg)
        this.log.notice(msg)
        this.log.help(msg)
        this.log.info(msg)
        this.log.verbose(msg)
        this.log.data(msg)
        this.log.debug(msg)
        this.log.silly(msg);
    }
}
export default RcliConnectCmd
