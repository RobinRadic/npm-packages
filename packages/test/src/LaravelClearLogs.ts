import { argument, command, Commands, option } from './rc';

@Commands.command({ handler: 'handle' })
export class LaravelClearLogs extends Commands.BaseCommand {
    // @option('a') all: boolean;
    // @option('f') force: boolean;
    // @option('s') strs: string[];
    // @option('F') func: Function;
    // @option('S') sym: symbol;
    @option('n', [ 'required' ]) num: number                                           = 1;
    @option('t', [ 'required', 'array' ], { validate: 'validateTimes' }) times: number = 1;


    async handle(
        @argument(true, 'Starting number', { validate: 'validateTimes' }) from: number,
        @argument('Ending number') to: number = 100,
        @argument('Ending number') sdf: string,
    ) {
        console.log('arguments', { from, to, sdf });
        const { num, times } = this;
        console.log('options', { num, times });
    }

    protected validateTimes(times: any) {
        times = parseInt(times); // should be handled because the data type is  n umber
        if ( times > 5 ) {
            return 'Cant exceed 5';
        }
        return true;
    }

}
// LaravelClearLogs.run('left right -t 3')
// LaravelClearLogs.run(process.argv.slice(2))
// LaravelClearLogs.run()

