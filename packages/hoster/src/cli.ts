import 'reflect-metadata';
import * as CliConfig    from '@oclif/config';
import { run as runCli } from '@oclif/command';

Error.stackTraceLimit = Infinity;

export async function run(argv?: string[], options?: CliConfig.LoadOptions) {
    // loadSettings()
    // const app = await bootstrap();

    return runCli(argv, options);
}



