#!/usr/bin/env node

import { ResetEvals } from './ResetEvals';

let re = new ResetEvals()

re.selectDirs().then(paths => {
    re.log('Selected paths', paths)
    paths.forEach(path => re.resetEval(path));
    re.removeJavaUserPrefs();
});
