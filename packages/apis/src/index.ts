///<reference path="../types/jenkins.d.ts"/>
///<reference path="../types/cache-manager.d.ts"/>

import { Bitbucket } from './services/Bitbucket';
import { Jira }      from './services/Jira';

export *             from './services/ServiceRegistry';

class Apis {
    get<T>(name):T{
        return;
    }
    configure(options:any){}
}
const apis = new Apis;

apis.configure({
    bb_oauth: {
        service: 'bitbucket',
        token: '',
        key: ''
    },
    bb_basic: {
        service: 'bitbucket',
        username: '',
        password: ''
    },
    jira_basic: {
        service: 'jira',
        username: process.env.JIRA_USERNAME,
        password: ''
    }
});

let bb = apis.get<Bitbucket>('bb_oauth')
let jira = apis.get<Jira>('jira_basic')

jira.project.getAllProjects({

}).then(async(res) => {
    let bbprojects = await bb.projects.getForTeam({
        username: 'mylink',
        project_key: res.data[0].key
    })
    bbprojects.data
    res.data[0].avatarUrls;
})
