import {Jira} from './Jira';
import { config } from 'dotenv';
import { resolve } from 'path';


export function connect() {
    const { parsed: env } = config({
        path: resolve(process.cwd(), '.env'),
    });

    const jira = new Jira({
        baseUrl: env.JIRA_URL,
    });

    jira.authenticate({
        type    : 'basic',
        username: env.JIRA_USERNAME,
        password: env.JIRA_PASSWORD,
    });
    return jira
}



