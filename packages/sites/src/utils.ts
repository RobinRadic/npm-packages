import { exec, ExecException }                  from 'child_process';
import { out }                                  from './cli/Output';
import { NginxConfFile, NginxConfFileInstance } from 'nginx-conf';


export const strHas = (segment: string) => new RegExp('.*' + segment + '.*');


export async function shell(command, log = true): Promise<{ error: ExecException | null, stdout: string, stderr: string }> {
    return new Promise((res, rej) => {
        if ( log ) {
            out.line(out.chalk.bold('$ ') + command);
        }
        const cmd = exec(command, {
            encoding: 'utf8',
        }, (error, stdout, stderr) => {
            res({ error, stdout, stderr });
        });
    });
}

export function createShell(command) {
    return async () => shell(command);
}


export function openNginxConfig(path): Promise<NginxConfFileInstance> {
    return new Promise((resolve, reject) => {
        NginxConfFile.create(path, (err, conf) => {
            err ? reject(err) : resolve(conf)
            // if ( err ) {return reject(err);} resolve(conf);
        });
    });
}
