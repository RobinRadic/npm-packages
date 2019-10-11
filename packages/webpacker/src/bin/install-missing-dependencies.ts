import { installMissingDependencies } from '../utils/installMissingDependencies';
import { Log } from '../Log';

// process.argv.forEach((val, key) => console.log(key, val))

const get = (arg: number) => process.argv[ arg ].trim().replace(/^"|"$/g, '').split(',');
Log.enableDebug();
process.on('SIGINT', function () {
    Log.debug('Caught interrupt signal');
    process.exit();
});

installMissingDependencies({
    dependencies   : get(3),
    devDependencies: get(5),
    confirm        : true,
    afterInstall   : () => {
        Log.debug('afterInstall callback');

    },
});
//
// let interval = setInterval(() => Log.debug('tick'), 1000);
// setTimeout(() => {
//     Log.debug('exit after 5 sec');
//     clearInterval(interval);
//     process.exit();
// }, 5000);
