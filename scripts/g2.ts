// noinspection ES6UnusedImports
import { Gulpclass, MergedTask, SequenceTask, Task } from 'gulpfile.ts/Annotations'
import * as gulp from 'gulp';

let del: any = require('del'); // you probably want to define a classes that does not have type definition this way


@Gulpclass()
export class Gulpfile {

    @Task()
    clean(cb: Function) {
        return del([ './dist/**' ], cb);
    }

    @Task()
    copyFiles() {
        return gulp.src([ './README.md' ])
            .pipe(gulp.dest('./dist'));
    }

    @Task('copy-source-files') // you can specify custom task name if you need
    copySourceFiles() {
        return gulp.src([ './src/**.js' ])
            .pipe(gulp.dest('./dist/src'));
    }

    @SequenceTask() // this special annotation using "run-sequence" module to run returned tasks in sequence
    build() {
        return [ 'copyFiles', 'copy-source-files' ];
    }

    @Task()
    default() { // because this task has "default" name it will be run as default gulp task
        return [ 'build' ];
    }

}