import 'reflect-metadata';
import { bootstrap } from '../index';

Error.stackTraceLimit=Infinity
import * as CliConfig from '@oclif/config';
import { run as runCli } from '@oclif/command'

export async function run(argv?: string[], options?: CliConfig.LoadOptions) {
    // loadSettings()
    const app = await bootstrap();

    return runCli(argv, options)
}

