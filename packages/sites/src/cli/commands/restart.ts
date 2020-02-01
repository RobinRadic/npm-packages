import { BaseCommand } from '../BaseCommand';
import { out }         from '../Output';

export default class RestartCommand extends BaseCommand {
    static description = 'Restart the services';

    async run() {
        await this.setup();
        await this.restartServices();
        out.success('Services restarted');

    }
}

