import { rc } from './rc';

const { command, argument, option } = rc;

@command('lv-clear-logs')
@argument('path').string.default('asf')
export class LaravelClearLogs {

    @option('a', [ 'f', 'b' ], { array: true })
    all: boolean;

}


let lcl = new LaravelClearLogs();
