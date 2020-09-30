import { BaseCommand } from '../BaseCommand';
import * as Parser     from '@oclif/parser';
import { flags }       from '@oclif/command';
import { Jenkins }     from '../../services/Jenkins';
import { Jira }        from '../../services/Jira';
import { Packagist }   from '../../services/Packagist';
import { Bitbucket }   from '../../services/Bitbucket';
import Repository = Bitbucket.Schema.Repository;
import { merge }       from 'lodash';


export default class InfoCommand extends BaseCommand {
    static description = 'Show info';

    //For variable length arguments, disable argument validation with static strict = false on the command.
    static strict: boolean               = false;
    static args: Parser.args.IArg<any>[] = [ { name: 'sites', description: 'site names', parse: input => input.split(' ') } ];

    static flags = {
        help    : flags.help({ char: 'h' }),
        all     : flags.boolean({ char: 'a', description: 'show all' }),
        enabled : flags.boolean({ char: 'e', description: 'show all enabled' }),
        disabled: flags.boolean({ char: 'd', description: 'show all not enabled' }),
    };

    protected success(text: string, afterText?: string) {
        this.io.success(this.io._out.figures.tick + ' ' + text);
        if ( afterText ) {
            this.io.line(afterText);
        }
        return this;
    }

    async jenkins() {

        let jenkins = new Jenkins({
            url        : process.env.JENKINS_URL,
            username   : process.env.JENKINS_USERNAME,
            password   : process.env.JENKINS_PASSWORD,
            crumbIssuer: true,
        });

        await jenkins.connect();
        let jobs = await jenkins.api.job.list();
        this.success(' Jenkins api', ' job.list : ' + jobs.map(job => job.name).join(', '));
        return jenkins;
    }

    async jira() {

        let jira = new Jira({
            baseUrl: process.env.JIRA_URL,
        });
        jira.authenticate({
            type    : 'basic',
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD,
        });
        let jiraUser = await jira.myself.getCurrentUser({ expand: 'groups,applicationRoles' });
        this.success('Jira api', `myself.getCurrentUser : ${jiraUser.data.displayName} (${jiraUser.data.emailAddress})`);
        return jira;
    }

    async packagist() {

        let packagist    = new Packagist({
            throwErrors: false,
            username   : process.env.PACKAGIST_USERNAME,
            token      : process.env.PACKAGIST_TOKEN,
            url        : process.env.PACKAGIST_URL,
        });
        let vendors      = [ 'radic', 'crvs', 'laradic', 'pyro' ];
        let lists        = await Promise.all(vendors.map(vendor => packagist.list({ vendor })));
        let streamAddons = await packagist.list({ type: 'streams-addon' });
        streamAddons     = streamAddons.filter(name => !name.startsWith('anomaly'));
        streamAddons.forEach(streamAddon => {
            //this.io.line(` - ${streamAddon}  :: https://packagist.org/packages/${streamAddon}`);
        });
        this.success('Packagist api', `list.slice(0.3) : ${streamAddons.slice(0, 3).join(', ')}`);
        return packagist;
    }

    async bitbucket() {

        let bitbucket = new Bitbucket({
            hideNotice: true,
            options   : {
                pagelen: 100,
            },
            // baseUrl: process.env.BITBUCKET_URL,
        });
        bitbucket.authenticate({
            type    : 'basic',
            username: process.env.BITBUCKET_USERNAME,
            password: process.env.BITBUCKET_PASSWORD,
        });

        const bitbucketUser = await bitbucket.user.get({});
        const bbRepos       = await bitbucket.repositories.list({
            pagelen : 100,
            username: 'mylink',
        });
        bbRepos.data.values.forEach(repo => {
            this.io.line(`{ name: '${repo.name}', owner: 'mylink', type: 'ssh', vcs: 'mylink' },`);
        });
        this.success('Bitbucket api', `user.get ${bitbucketUser.data.display_name} (${bitbucketUser.data.username})`);
        return bitbucket;
    }

    async fetchAll<T>(fn, params): Promise<T> {

        let p                       = { pagelen: 10, page: 1 };
        params.pagelen              = 5;
        const response              = await fn(params);
        let { pagelen, size, page } = response.data;
        if ( size <= pagelen ) {
            return response.data.values as any;
        }
        let values: any[] = response.data.values;
        let totalPages    = Math.floor(size / pagelen);
        let pages         = Array.from(Array(totalPages), (_, i) => i + 1);
        for ( const current of pages ) {
            let pa     = { ...params };
            pa.page    = page;
            pa.pagelen = 10;
            let res    = await fn.apply(this, [ pa ]);
            values.push(...res.data.values);
        }

        return values as any;
    }

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        await this.bitbucket();

        // await Promise.all([
        //     this.jenkins(),
        //     this.jira(),
        //     this.packagist(),
        //     this.bitbucket(),
        // ]);

        // let github = new Github({
        //
        // });

        this.io.info('info');
    }

}
