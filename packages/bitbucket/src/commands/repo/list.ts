import Base from '../../Base';

export default class RepoList extends Base {
    static description = 'List repositories';

    static args = [ { name: 'owner' } ];

    async run() {
        const bb       = await this.setup();
        const { args } = this.parse(this.constructor)
        if ( args.owner ) {
            await this.printRepos(args.owner);
            return ;
        }
        const usernames = [];
        const reponames = [];
        const teams     = await bb.teams.list({ pagelen: 100, role: 'admin' })
        for ( const team of teams.data.values ) {
            usernames.push(team.username)
        }
        // usernames.push(this.settings.user.username);
        const promises = [];
        for ( const username of usernames ) {
            promises.push(this.printRepos(username));
        }
        await Promise.all(promises)
    }

    async printRepos(username: string): Promise<string[]> {
        const repos = await this.bitbucket.repositories.list({ pagelen: 100, username })
        for ( const repo of repos.data.values ) {
            this.log(` - ${repo.full_name}`)
        }
        return repos.data.values.map(val => val.full_name);
    }
}
