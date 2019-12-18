import { BaseCommand } from '../BaseCommand';
import { out }         from '../Output';

export default class TestCommand extends BaseCommand {
    static description = 'Test';

    async run() {
        await this.setup();
        await this.restartServices();
        out.success('Services restarted');

    }
}

