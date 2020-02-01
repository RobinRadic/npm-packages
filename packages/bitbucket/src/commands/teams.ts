import Base from '../Base';

export default class Teams extends Base {
    static description = 'List your teams';

    async run() {
        const bb    = await this.setup();
        // const repos = await bb.repositories.list({ pagelen: 100, username: this.settings.user.username })
        const teams = await bb.teams.list({pagelen: 100, role: 'admin'})
        for(var team of teams.data.values){
            this.log(team.username)
        }
    }
}
