import { alwaysRun, command, CommandConfig, Config, lazyInject, Log, OptionConfig, OutputHelper } from '../../';


@command('r {command:string@any of the listed commands}', <CommandConfig> {
    isGroup          : true,
    // subCommands: [ 'connect' ],
    onMissingArgument: 'help'
})
export class RcliCmd {
    // automaticly added
    _config: CommandConfig
    _options: OptionConfig[]
    showHelp: () => void

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config;

    @lazyInject('cli.helpers.output')
    out: OutputHelper;


    @alwaysRun()
    always() {
        if ( this.config('debug') === true ) {
            this.log.level = 'debug';
            this.log.debug('Debug is enabled')
        }
    }

    handle() {

        this.out.dump(require.resolve('cli-spinner'))
        let data: object[] = require('../data.json')
        let table          = this.out.table({ head: Object.keys(data[ 0 ]), chars: this.out.config.tableStyle.NONE })
        Object.keys(data).forEach(key => table[ 'addRow' ](Object.values(data[ key ])))
        this.out.writeln(table.toString())
    }
}

export default RcliCmd
