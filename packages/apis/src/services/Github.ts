import BaseGithub from '@octokit/rest';


export type Github = BaseGithub.Octokit
export const Github: typeof BaseGithub = BaseGithub;

