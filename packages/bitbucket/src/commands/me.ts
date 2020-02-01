import Base from '../Base';

export default class Me extends Base {
    static description = 'Show the current authenticated user';
    async run() {
        await this.setup();
        const user = await this.bitbucket.user.get({})
        this.log(`You are ${user.data.display_name} - logged in using username [${user.data.username}]`);
        return true;
    }
}
