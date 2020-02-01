import { AbstractExtension } from './AbstractExtension';
import { debug }             from '../debug';

const log = debug.extend('DeployExtension');

export class DeployExtension extends AbstractExtension {
    public start() {
        const { app, config, slack } = this;
        log('start')
        slack.message('deploy', ({ message, say, payload, event, body }) => {
            console.log('deploy', { message, say, payload, event, body });
            say('deploy what?');
        });
    }

    getDeploymentRepositories() {
        return this.config.get('deploy.repositories', []).map(data => new DeploymentRepository(data));
    }

    addDeploymentRepository() {}

    getDeploymentRepository() {}

    deploy() {}
}


export class DeploymentRepository {
    constructor(protected data) {}
}
