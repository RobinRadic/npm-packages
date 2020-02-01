import Base from '../Base';
import { password, username } from '../flags';
import { AuthBasic } from 'bitbucket';

export default class Login extends Base {
    static description = 'Login to bitbucket';
    static flags       = {
        username: username(),
        password: password(),
    };
    static args        = [ { name: 'file' } ];
    skipAuth           = true

    async run() {
        await this.setup();
        const { args, flags } = this.parse(Login);
        const settings        = this.settingsLoader.load();
        if ( ! settings.hasAuth ) {
            settings.auth.username = flags.username || await this.prompt('Username? ', { required: true })
            settings.auth.password = flags.password || await this.prompt('Password? ', { required: true, type: 'hide' })
        }

        try {
            this.bitbucket.authenticate({ type: 'basic', ...settings.auth } as AuthBasic);
            const user    = await this.bitbucket.user.get({})
            settings.user = user.data;
        } catch ( e ) {
            this.error('Authentication not successfull', { exit: 1 })
        }

        this.settingsLoader.update(settings)

        this.log('Success');

        return true;
    }
}
