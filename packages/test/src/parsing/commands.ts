import { defaults } from 'lodash';
import { meta }   from '../util';
import { Exit }   from '../types';
import { Parser } from './Parser';

export interface Decorator {
    (options?: Options)
}

export type Handler = ((...args) => Promise<any>) | string

export interface Options {
    name?: string
    handler?: Handler
    autoRun?: boolean
}

export const defaultMetadata = (target: object) => ({
    options: {
        name   : target.constructor.name,
        handler: 'handle',
        autoRun: true,
    },
});

export const isHandlerFunction = (value: any): value is Function => typeof value === 'function';
export const isHandlerName     = (value: any): value is string => typeof value === 'string';

export async function run<T extends RuntimeCommand>(target, argv): Promise<Exit> {
    let parser = new Parser<T>(target);
    //let parsed = parser.parseOptions(argv);
    //let args   = parser.prepareArguments(parsed.argv._);
    let command = parser.parse(argv);
    return await command.__handle();
}

export let command: Decorator = (options?: Options): ClassDecorator => {
    return target => {
        options = defaults({
            name   : target.constructor.name,
            handler: 'handle',
            autoRun: true,
        }, options);
        let m   = meta(target);
        m.set('command', options);

        class RuntimeCommand extends (target as any) {
            static async run(argv?: string | string[]) {
                argv         = argv || process.argv.slice(2);
                //let code = await run(this as any, argv);
                let parser   = new Parser<RuntimeCommand>(this);
                let command  = parser.parse(argv);
                let exit = await command.__handle();
                process.exit(Exit.code(exit));
            }
        }

        if ( options.autoRun ) {
            RuntimeCommand.run().then(result => {
                console.log('end', result);
            });
        }

        return BaseCommand as any;
    };
};


export interface BaseCommand extends RuntimeCommand {

}

export class BaseCommand {
    protected defaultExitCode: Exit = Exit.OK;

    protected exit(exitCode: Exit) {
        process.exit(Exit[ exitCode ]);
    }
}

export declare class RuntimeCommand {
    static run(argv?: string | string[]): Promise<any>

    __handle(): Promise<Exit>
}
