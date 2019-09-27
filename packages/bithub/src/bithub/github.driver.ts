import { injectable } from 'inversify';
import { inject } from '../app';
import { Github } from '../classes/Github';
import { OrgsListForAuthenticatedUserResponse, ReposListForOrgResponseItem, UsersGetAuthenticatedResponse } from '@octokit/rest';
import { AbstractDriver, Bithub } from './Bithub';

// import Github from '@octokit/rest';

class GithubTransformer {
    static repository = (r: ReposListForOrgResponseItem): Repository => ({
        slug          : r.name.toLowerCase(),
        full_name     : r.full_name.toLowerCase(),
        owner         : r.owner.login.toLowerCase(),
        default_branch: r.default_branch,
        private       : r.private,
        urls          : {
            https: r.clone_url,
            ssh  : r.ssh_url,
        },
    });
}

@injectable()
export class GithubDriver extends AbstractDriver implements Driver, Api {
    @inject('github') client: Github;

    public driver(name: string): Driver {
        return undefined;
    }


    protected async __getCurrentUser(): Promise<{
        user: UsersGetAuthenticatedResponse
        groups: OrgsListForAuthenticatedUserResponse
        repos: ReposListForOrgResponseItem[]
    }> {
        const user   = await this.client.users.getAuthenticated({});
        const groups = await this.client.orgs.listForAuthenticatedUser({ per_page: 300 });
        const repos  = await this.client.repos.listForUser({ type: 'owner', username: user.data.login, per_page: 300 });
        return { user: user.data, groups: groups.data, repos: repos.data };
    }

    public async getCurrentUser() {
        const { user, groups, repos }               = await this.__getCurrentUser();
        const repositories: Repository[] = repos.map(r => GithubTransformer.repository(r));
        return {
            username    : user.login.toLowerCase(),
            display_name: user.name,
            groups      : groups.map(group => group.login.toLowerCase()),
            repositories,
        };
    }

    async __getRepository(owner: string, slug: string) {
        const repo     = await this.client.repos.get({ owner, repo: slug });
        const webhooks = await this.client.repos.listHooks({ owner, repo: slug, per_page: 300 });
        const branches = await this.client.repos.listBranches({ owner, repo: slug, per_page: 300 });
        return { repo: repo.data, webhooks: webhooks.data, branches: branches.data };
    }

    public getOwner(name: string): Promise<Owner> {
        return undefined;
    }

    public async getRepository(owner: string, slug: string): Promise<FullRepository> {
        const { repo, webhooks, branches } = await this.__getRepository(owner, slug);
        return {
            ...GithubTransformer.repository(repo),
            webhooks: webhooks.map(hook => hook),
            branches: branches.map(branch => branch.name),
        };
    }
}
