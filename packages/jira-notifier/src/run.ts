import { JiraNotifier } from './JiraNotifier';
import Timeout = NodeJS.Timeout;

let intervalHandler: Timeout;

async function run() {

    const jn       = new JiraNotifier();
    const issues   = await jn.searchIssues();
    const keys     = issues.map(issue => issue.key);
    const verbose  = jn.config.get('verbose', false);
    const interval = jn.config.get('interval', 5);
    verbose && console.dir({ time: Date.now(), keys: keys.join(', ') });
    if ( jn.hasIssueKeys() ) {
        const newKeys = jn.getNewIssueKeys(keys);
        verbose && console.dir({ newKeys });
        if ( intervalHandler && newKeys.length > 0 ) {
            let newIssues = issues.filter(issue => newKeys.includes(issue.key));
            verbose && console.dir({ issues });
            for ( const issue of newIssues ) {
                jn.notifyAssignedIssue(issue as any);
            }
        }
    }
    jn.setIssueKeys(keys);

    if ( intervalHandler === undefined ) {
        intervalHandler = setInterval(() => {
            run();
        }, 1000 * interval);
    }
}

run();

