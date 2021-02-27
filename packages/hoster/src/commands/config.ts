import { BaseCommand } from '../lib';

export default class ConfigCommand extends BaseCommand {
    static description = 'Config command';

    async run() {
        this.out.line('tester starting');

        const self = this;

        let answers = await this.ask.datetime('Select Files', {

            message: 'When would you like a table?',
            initial: new Date('2017-01-01 12:30'),

        });

        console.dir({ answers, self });


        return;
    }
}

