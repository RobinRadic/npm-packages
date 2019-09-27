import yargs from 'yargs';
import nodemon from 'nodemon'
import { JiraNotifier } from './JiraNotifier';
import Timeout = NodeJS.Timeout;
import { resolve } from 'path';


let argv = yargs
    .help('h', 'Show this help')
    .alias('h', 'help')
    // .default({
    //     commit: true,
    //     tag   : false,
    //     bump  : null,
    // })
    // .boolean('commit').alias('c', 'commit')
    .showHelpOnFail(true)
    .parserConfiguration({
        'boolean-negation': true,
    })
    // .command('set','Configure')
    // .command('start','Start')
    // .command('reset','Reset')
    .options({
        url     : {
            // alias  : 'u',
            // default: true,
            type: 'string',
            // desc   : 'Toggles git commit on/off. If disabled, tag will be disabled aswell',
        },
        username: {
            // alias  : 'u',
            // default: false,
            type: 'string',
            // desc   : 'Toggles git tag on/off',
        },
        password: {
            // alias  : 'p',
            // default: null,
            type: 'string',
            // desc   : 'If provided, will preform the given bump to the version',
            // choices: [ 'patch', 'minor', 'major', 'custom' ],
        },
        reset   : {
            alias  : 'r',
            default: false,
            type   : 'boolean',
            // desc   : 'Enables interactive option questions',
        },
        interval: {
            alias  : 'i',
            default: 5,
            type   : 'number',
            desc   : 'Poll interval (seconds)',
        },
        verbose   : {
            alias  : 'v',
            default: false,
            type   : 'boolean',
            // desc   : 'Enables interactive option questions',
        },
        daemonize   : {
            alias  : 'd',
            default: false,
            type   : 'boolean',
            // desc   : 'Enables interactive option questions',
        },
    })
    .argv;


// setup width
let width = yargs.terminalWidth();
width     = width > 250 ? 250 : width;
yargs.wrap(width);

async function runCli() {
    const jn = new JiraNotifier()
    if(argv.daemonize){
        require('./run.js')
    }
    if ( argv.reset ) {
        jn.resetConfig();

    }
    const url      = argv.url || await jn.getClientUrl();
    const username = argv.username || await jn.getClientUsername();
    const password = argv.password || await jn.getClientPassword();
    jn.config.set('verbose', argv.verbose)
    jn.config.set('interval', argv.interval)
    const client   = jn.createClient(url, username, password);
}

runCli()
