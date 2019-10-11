import { spawn } from 'child_process';
// import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { Log } from '../Log';

let filepath = {
    process: resolve(process.cwd(), 'process.id'),
    proc   : resolve(process.cwd(), 'proc.id'),
};

export function restart(exitTimeout: number = 1000) {
    // existsSync(filepath.process) && unlinkSync(filepath.process)
    // existsSync(filepath.proc) && unlinkSync(filepath.proc)
    // writeFileSync( filepath.process, process.pid.toString())
    setTimeout(() => {
        const argv = [ ...process.argv ];
        const cwd  = process.cwd();
        let proc   = spawn(argv.shift(), argv, {
            detached: true,
            stdio   : 'inherit',
            env     : process.env,
            cwd,
        });
        process.on('SIGINT', function () {
            Log.enableDebug().debug('Caught interrupt signal');
            proc.kill('SIGKILL');
            process.kill(proc.pid);
            process.kill(process.pid);
            process.exit();
        });
        // writeFileSync(filepath.proc,proc.pid.toString())
        proc.unref();
        // process.on('exit', code => {
        // });
        process.kill(process.pid);
        process.exit();
    }, exitTimeout);
}


export function spawnAndExit(args: string[] = [], exitTimeout: number = 50) {
    setTimeout(() => {
        const cwd = process.cwd();
        process.on('exit', code => {
            let proc = spawn(args.shift(), args, {
                detached: true,
                stdio   : 'inherit',
                cwd,
            });
            proc.unref();
            proc.stdout.on('data', chunk => {process.stdout.write(chunk);});
        });
        process.exit();
    }, exitTimeout);
}
