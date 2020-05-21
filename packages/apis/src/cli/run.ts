import 'reflect-metadata';

Error.stackTraceLimit=Infinity
import * as CliConfig       from '@oclif/config';
import { run as runCli }    from '@oclif/command'
import { config as dotenv } from 'dotenv';

export async function run(argv?: string[], options?: CliConfig.LoadOptions) {
    // loadSettings()
    // const app = await bootstrap();

    dotenv();
    return runCli(argv, options)
}

