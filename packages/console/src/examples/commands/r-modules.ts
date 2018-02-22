import { command, CommandConfig, Config, lazyInject, Log, OptionConfig, OutputHelper } from '../../';

@command('modules|3')
export class ModulesCmd {
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


    async handle() {
        // const notifier = this.out.notify({
        //     title: 'My awesome title',
        //     message: 'Hello from node, Mr. User!',
        //     sound: true, // Only Notification Center or Windows Toasters
        //     wait: true // Wait with callback, until user action is taken against notification
        // }, function (err, response) {
        //     // Response is response from notification
        // });
        //
        // notifier.on('click', function (notifierObject, options) {
        //     // Triggers if `wait: true` and user clicks notification
        // });
        //
        // notifier.on('timeout', function (notifierObject, options) {
        //     // Triggers if `wait: true` and notification closes
        // });
        // this.out.dump({log})

        // this.out.sparkly([1, 2, 3, 4, 5, 6, 7, 8], {max: 30, style: 'fire'});
        //
        // let code = readFileSync(__filename.replace('.js','.ts'), 'utf-8')
        // this.out.highlight(code, {
        //     language: 'typescript',
        //     theme: 'g'
        // })

        const multispinner = this.out.multispinner([ 'foo', 'bar' ], {
            preText: 'Completing'
        })

        multispinner.start();

        setTimeout(() => multispinner.success('foo'), 1000)
        setTimeout(() => multispinner.error('bar'), 2000)
        return new Promise((res, rej) => multispinner.on('done', () => res()))

    }


}

export default ModulesCmd
