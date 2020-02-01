Error.stackTraceLimit=Infinity
import * as CliConfig from '@oclif/config';
import { run as runCli } from '@oclif/command'

export function run(argv?: string[], options?: CliConfig.LoadOptions): PromiseLike<any> {
    // loadSettings()

    return runCli(argv, options)
}

