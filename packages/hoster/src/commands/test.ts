import { BaseCommand } from '../lib';

export default class TestCommand extends BaseCommand {
    static description = 'Restart the services';

    async run() {
        await this.ask.confirm('Continue?');
    }
}

