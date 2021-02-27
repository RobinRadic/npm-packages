import 'reflect-metadata';
import * as CliConfig    from '@oclif/config';
import { run as runCli } from '@oclif/command';
import ChromeDriver from 'chromedriver'

Error.stackTraceLimit = Infinity;

export async function run(argv?: string[], options?: CliConfig.LoadOptions) {
    // loadSettings()
    // const app = await bootstrap();


    CliConfig.load()
    const cli = await runCli(argv, options);

    return cli;
}



