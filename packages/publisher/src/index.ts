import yargs from 'yargs';


let argv = yargs
    .help('h', 'Show this help')
    .default({
        commit: true,
        tag   : false,
        bump  : null,
    })
    .boolean('commit').alias('c', 'commit')
    .showHelpOnFail(true)
    .parserConfiguration({
        'boolean-negation': true,
    })
    .options({
        commit     : {
            alias  : 'c',
            default: true,
            type   : 'boolean',
            desc   : 'Toggles git commit on/off. If disabled, tag will be disabled aswell',
        },
        tag        : {
            alias  : 't',
            default: false,
            type   : 'boolean',
            desc   : 'Toggles git tag on/off',
        },
        bump       : {
            alias  : 'b',
            default: null,
            type   : 'string',
            desc   : 'If provided, will preform the given bump to the version',
            choices: [ 'patch', 'minor', 'major', 'custom' ],
        },
        interactive: {
            alias  : 'i',
            default: false,
            type   : 'boolean',
            desc   : 'Enables interactive option questions',
        },
    })
    .argv;



// setup width
let width = yargs.terminalWidth();
width     = width > 250 ? 250 : width;
console.log('width',width);
yargs.wrap(width);


yargs.showHelp();
console.dir(argv);
