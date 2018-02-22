import { helper } from '../../decorators';
import { VerboseHelperOptionsConfig } from '../../interfaces';
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, container, HelpersStartedEvent, inject } from '../../core';
import { LoggerInstance } from 'winston';
import { logLevels, logModule } from '../log';

@helper('verbose', {
    singleton: true,
    config   : {
        option: {
            enabled: true,
            key    : 'v',
            name   : 'verbose'
        }
    },
    listeners: {
        'cli:parsed'        : 'onExecuteCommandParsed',
        'cli:execute:parse' : 'onExecuteCommandParse',
        'cli:execute:parsed': 'onExecuteCommandParsed',
        'helpers:started': 'onHelpersStarted'
    }
})
export class VerbosityHelper {
    config: VerboseHelperOptionsConfig;

    @inject('cli.log')
    log: LoggerInstance;

    public onExecuteCommandParse(event: CliExecuteCommandParseEvent) {
        if ( this.config.option.enabled ) {
            event.cli.global(this.config.option.key, {
                name       : this.config.option.name,
                count      : true,
                // tyhpe
                description: 'increase verbosity (1:verbose|2:data|3:debug|4:silly)'
            })
        }
    }

    public onExecuteCommandParsed(event: CliExecuteCommandParsedEvent) {
        if ( this.config.option.enabled && event.argv[ this.config.option.key ] ) {
            let level: number = parseInt(event.argv[ this.config.option.key ]);

            level = logLevels.indexOf('info') + level;
            if ( level > logLevels.length - 1 ) {
                level = logLevels.length - 1;
            }
            let levelName: string = logLevels[ level ] as string
            this.log.level        = levelName;

            this.log.verbose(`Verbosity set (${level} : ${levelName} : ${this.log.level})`)
        }
    }

    public onHelpersStarted(event:HelpersStartedEvent){
        container.load(logModule);
    }
}