import { BaseCommand } from '../BaseCommand';
import * as Parser     from '@oclif/parser';
import { flags }       from '@oclif/command';
import { Jenkins }     from '../../services/Jenkins';
import { Jira }        from '../../services/Jira';
import { Packagist }   from '../../services/Packagist';
import { Bitbucket }   from '../../services/Bitbucket';
import { Github }      from '../../services/Github';


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

    async run() {
        await this.setup();
        const { args, flags } = this.parse(this.constructor);

        let jenkins = new Jenkins({
            url        : process.env.JENKINS_URL,
            username   : process.env.JENKINS_USERNAME,
            password   : process.env.JENKINS_PASSWORD,
            crumbIssuer: true,
        });

        await jenkins.connect();
        let jobs = await jenkins.api.job.list();
        this.io.success('Jenkins api : job.list : ' + jobs.map(job => job.name).join(', '));

        let jira = new Jira({
            baseUrl: process.env.JIRA_URL,
        });
        jira.authenticate({
            type    : 'basic',
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD,
        });
        let jiraUser = await jira.myself.getCurrentUser({ expand: 'groups,applicationRoles' });
        this.io.success(`Jira api : myself.getCurrentUser : ${jiraUser.data.displayName} (${jiraUser.data.emailAddress})`);


        let packagist     = new Packagist({
            throwErrors: false,
            username   : process.env.PACKAGIST_USERNAME,
            token      : process.env.PACKAGIST_TOKEN,
            url        : process.env.PACKAGIST_URL,
        });
        let vendors = ['radic','crvs','laradic','pyro'];
        let lists = await Promise.all(vendors.map(vendor => packagist.list({vendor})));
        let streamAddons = await packagist.list({type: 'streams-addon'});
        streamAddons = streamAddons.filter(name => !name.startsWith('anomaly'))
        streamAddons.forEach(streamAddon => {
            this.io.line(` - ${streamAddon}  :: https://packagist.org/packages/${streamAddon}`);
        })
        this.io.success(`Packagist api : list.slice(0.3) : ${streamAddons.slice(0, 3).join(', ')}`);

        // let github = new Github({
        //
        // });

        let bitbucket = new Bitbucket({
            hideNotice:true,
            // baseUrl: process.env.BITBUCKET_URL,
        });
        bitbucket.authenticate({
            type    : 'basic',
            username: process.env.BITBUCKET_USERNAME,
            password: process.env.BITBUCKET_PASSWORD,
        });
        const bitbucketUser = await bitbucket.user.get({});
        this.io.success(`Bitbucket api : user.get ${bitbucketUser.data.display_name} (${bitbucketUser.data.username})`)
        this.io.info('info');
    }

}
