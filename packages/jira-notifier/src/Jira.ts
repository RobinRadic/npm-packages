import BaseJira, { Options } from '@atlassian/jira';

export interface RequestOptions extends Options {

    accepts?: any
    body?: any
    method?: string
    url?: string
}

export interface Jira {
    request(options: RequestOptions): Promise<any>
}

export class Jira extends BaseJira {

}

