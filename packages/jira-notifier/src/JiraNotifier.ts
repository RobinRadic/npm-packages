/**
 * @see https://github.com/sindresorhus/conf#usage
 * @see https://github.com/mikaelbr/node-notifier#readme
 */

import Conf from 'conf';
import { Jira } from './Jira';
import inquirer from 'inquirer';
import { notify } from 'node-notifier';
import { Params, Schema } from '@atlassian/jira';
import { merge } from 'lodash';


export class JiraNotifier {
    config: Conf<any>;
    private _client: Jira;

    constructor() {
        this.config = new Conf({});
    }

    createClient(url, username, password) {
        this._client = new Jira({
            baseUrl: url + '/rest/',
        });
        this._client.authenticate({
            type: 'basic',
            username,
            password,
        });
        return this._client;
    }

    getClient() {
        if ( this._client === undefined ) {
            return this.createClient(
                this.config.get('url'),
                this.config.get('username'),
                this.config.get('password'),
            );
        }
        return this._client;
    }

    async getClientUrl(): Promise<string> {
        if ( !this.config.has('url') ) {
            const question = await inquirer.prompt({ name: 'url', message: 'Jira URL: ' });
            this.config.set('url', question.url);
        }
        return this.config.get('url');
    }

    async getClientUsername(): Promise<string> {
        if ( !this.config.has('username') ) {
            const question = await inquirer.prompt({ name: 'username', message: 'Jira username: ' });
            this.config.set('username', question.username);
        }
        return this.config.get('username');
    }

    async getClientPassword(): Promise<string> {
        if ( !this.config.has('password') ) {
            const question = await inquirer.prompt({ name: 'password', message: 'Jira password: ', type: 'password' });
            this.config.set('password', question.password);
        }
        return this.config.get('password');
    }

    resetConfig() {
        this.config.clear();
    }

    async searchIssues(params: Params.SearchSearchForIssuesUsingJqlGet = {}) {
        const result = await this.getClient().search.searchForIssuesUsingJqlGet(merge({
            jql       : 'assignee = currentUser()',
            maxResults: 1000,
            fields    : [ 'summary', 'description', 'creator', 'priority' ],
        }, params));
        const issues = result.data.issues;
        return issues;
    }

    notifyAssignedIssue(issue: IssueBean) {
        // @ts-ignore
        notify({
            type   : 'info',
            title  : `Assigned to you: ${issue.key} [${issue.fields.priority.name}] - ${issue.fields.summary}`,
            icon   : issue.fields.creator.avatarUrls[ '48x48' ],
            timeout: 5,
            time   : 5000,
            message: `${issue.fields.summary}        
${issue.fields.description}`,
        });
    }

    hasIssueKeys() {
        return this.config.has('keys');
    }

    getIssueKeys(): string[] {
        return this.config.get('keys', []);
    }

    setIssueKeys(keys: string[]) {
        this.config.set('keys', keys);
        return this;
    }

    getNewIssueKeys(keys: string[]): string[] {
        const prevKeys = this.getIssueKeys();
        return keys.filter(key => prevKeys.includes(key) === false);
    }

}


interface IssueBean extends Schema.IssueBean {
    fields?: IssueFields
}

declare module IssueFields {

    export interface Issuetype {
        self: string;
        id: string;
        description: string;
        iconUrl: string;
        name: string;
        subtask: boolean;
        avatarId: number;
    }

    export interface AvatarUrls {
        '48x48': string;
        '24x24': string;
        '16x16': string;
        '32x32': string;
    }

    export interface Project {
        self: string;
        id: string;
        key: string;
        name: string;
        projectTypeKey: string;
        avatarUrls: AvatarUrls;
    }

    export interface Watches {
        self: string;
        watchCount: number;
        isWatching: boolean;
    }


    export interface Creator {
        self: string;
        name: string;
        key: string;
        emailAddress: string;
        avatarUrls: AvatarUrls;
        displayName: string;
        active: boolean;
        timeZone: string;
    }

    export interface Reporter {
        self: string;
        name: string;
        key: string;
        emailAddress: string;
        avatarUrls: AvatarUrls;
        displayName: string;
        active: boolean;
        timeZone: string;
    }

    export interface Aggregateprogress {
        progress: number;
        total: number;
    }

    export interface Priority {
        self: string;
        iconUrl: string;
        name: string;
        id: string;
    }

    export interface Progress {
        progress: number;
        total: number;
    }

    export interface Votes {
        self: string;
        votes: number;
        hasVoted: boolean;
    }

    export interface Assignee {
        self: string;
        name: string;
        key: string;
        emailAddress: string;
        avatarUrls: AvatarUrls;
        displayName: string;
        active: boolean;
        timeZone: string;
    }

    export interface StatusCategory {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
    }

    export interface Status {
        self: string;
        description: string;
        iconUrl: string;
        name: string;
        id: string;
        statusCategory: StatusCategory;

    }
}

export interface IssueFields {
    issuetype: IssueFields.Issuetype;
    project: IssueFields.Project;
    lastViewed: Date;
    watches: IssueFields.Watches;
    creator: IssueFields.Creator;
    created: Date;
    reporter: IssueFields.Reporter;
    aggregateprogress: IssueFields.Aggregateprogress;
    priority: IssueFields.Priority;
    progress: IssueFields.Progress;
    votes: IssueFields.Votes;
    assignee: IssueFields.Assignee;
    updated: Date;
    status: IssueFields.Status;
    components: any[];
    timespent?: any;
    timeoriginalestimate?: any;
    description: string;
    fixVersions: any[];
    aggregatetimespent?: any;
    resolution?: any;
    customfield_10104?: any;
    customfield_10302?: any;
    customfield_10105: string;
    customfield_10303?: any;
    aggregatetimeestimate?: any;
    resolutiondate?: any;
    workratio: number;
    summary: string;
    subtasks: any[];
    customfield_10000: string;
    customfield_10100?: any;
    labels: any[];
    environment?: any;
    timeestimate?: any;
    aggregatetimeoriginalestimate?: any;
    versions: any[];
    duedate: string;
    issuelinks: any[];
}


