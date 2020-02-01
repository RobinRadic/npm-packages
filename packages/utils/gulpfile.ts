// noinspection ES6UnusedImports
import gulp, { dest, src }               from 'gulp';
// noinspection ES6UnusedImports
import { Gulpclass, Task }               from 'gulpclass';
// noinspection ES6UnusedImports
import gulpTypescript, { createProject } from 'gulp-typescript';
// import gulpRollup                        from 'gulp-rollup-stream';
// noinspection ES6UnusedImports
// noinspection ES6UnusedImports
import del                               from 'del';
// noinspection ES6UnusedImports
import { log }                           from 'gulp-util';


const timeoutLog = (msg, ...opt) => new Promise(res => {
    setTimeout(() => {
        log(msg, opt);
        res();
    }, 2000);
});

@Gulpclass(gulp)
export class Gulpfile {
    @Task('default')
    async default() {
        log('start');
        await timeoutLog('first');
        return timeoutLog('done!!');
    }

    @Task('clean')
    async clean(){
        del(['cjs','es','es6','esm','module','umd'], {

        })
    }


    @Task('build')
    async build() {

        const project = createProject('tsconfig.build.json', {
            module: 'esnext',
            target: 'es6',
        });
        return src('./src/**/*.ts')
            .pipe(project(gulpTypescript.reporter.fullReporter(true)))
            .pipe(dest('es6'));
    }

}
