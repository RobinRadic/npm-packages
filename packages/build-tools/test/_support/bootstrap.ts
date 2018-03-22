import 'chai/register-assert'; // Using Assert style
import 'chai/register-expect'; // Using Expect style
import 'chai/register-should';
import { paths } from './paths';
import { copySync, pathExistsSync, removeSync } from 'fs-extra'; // Using Should style

export function bootstrap(): void {
    refreshProjectFixture();
}

export function refreshProjectFixture() {
    let projectPath = paths.fixtures('project');
    if ( pathExistsSync(projectPath) ) {
        removeSync(projectPath);
    }
    copySync(paths.fixtures('_project'), projectPath);
}