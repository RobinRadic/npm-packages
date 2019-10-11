/** @see https://github.com/kentcdodds/nps/blob/master/other/EXAMPLES.md */

const {ncp, rimraf} = require('nps-utils');


module.exports = {
    scripts: {
        default: 'nps',
        test   : 'nps test',
        release: 'release-it',
        np     : 'np',
        nps    : 'nps',
        clean: rimraf([
            'dist',
            'node_modules',
            'yarn.lock',
            'yarn-err*',
            'package-lock.json'
        ].join(' ')),
        build: ['']
    }
};

/*

- clean
- install
- test
- clean
- copy & cd to subdir
- build/compile
-

 */
