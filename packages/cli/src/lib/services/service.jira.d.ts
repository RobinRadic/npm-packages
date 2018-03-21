import { AbstractService } from "./AbstractService";
import { AxiosRequestConfig } from "axios";
import { ServiceExtraFields } from "../interfaces";
export interface JiraServiceExtraFields extends ServiceExtraFields {
    url?: string;
    version?: string;
}
declare namespace data {
    type AvatarDimension = '48x48' | '32x32' | '24x24' | '16x16';
    interface AvatarUrls {
        '48x48': string;
        '32x32': string;
        '24x24': string;
        '16x16': string;
    }
    interface IssueType {
        self: string;
        id: string;
        description: string;
        iconUrl: string;
        name: string;
        subtask: boolean;
        avatarId: number;
    }
    interface User {
        self: string;
        key: string;
        accountId: string;
        name: string;
        avatarUrls: AvatarUrls;
        displayName: string;
        active: boolean;
    }
    interface Project {
        self: string;
        expand: string;
        id: string;
        key: string;
        name: string;
        projectTypeKey: string;
        avatarUrls: AvatarUrls;
        projectCategory: {
            self: string;
            id: string;
            name: string;
            description: string;
        };
        projectKeys?: string[];
        issueTypes?: IssueType[];
        lead?: User;
        description?: string;
    }
}
export { data as jiraData };
export declare class JiraService extends AbstractService<JiraServiceExtraFields> {
    configure(options?: AxiosRequestConfig): AxiosRequestConfig;
    protected handleCatchedError(error: any): any;
    listProjects(): Promise<data.Project[]>;
}
