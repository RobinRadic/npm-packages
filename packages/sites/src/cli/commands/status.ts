import { BaseCommand } from '../BaseCommand';
import { Services }    from '../../Services';

export default class StatusCommand extends BaseCommand {
    static description = 'Services Status';

    async run() {
        await this.setup();

        let states =await Services.statusAll([
            'apache2',
            'nginx',
            'php7.3-fpm',
            'php7.4-fpm',
        ])

        states.forEach(state => this.io.line(state.stdout));
        return;
    }
}

