import { injectable } from 'inversify';
import { inject } from '../app';
import { Bitbucket } from '../classes/Bitbucket';
import { Schema } from 'bitbucket';
import { AbstractDriver } from './Bithub';
import { BithubRepository } from './responses';
import { Driver, Repository, Api, Owner } from './interfaces';

// import Github from '@octokit/rest';


class BitbucketTransformer {
    static repository = (r: Schema.Repository): Repository => ({
        slug          : r.slug.toLowerCase(),
        full_name     : r.full_name.toLowerCase(),
        owner         : r.full_name.split('/')[ 0 ].toLowerCase(),
        private       : r.is_private,
        default_branch: r.mainbranch.name,
        urls          : {
            https: r.links.clone[ 0 ].href,
            ssh  : r.links.clone[ 1 ].href,
        },
    });
}

@injectable()
export class BitbucketDriver extends AbstractDriver implements Driver, Api {
    @inject('bitbucket') client: Bitbucket;

    public driver(name: string): Driver {
        return this.driver(name);
    }

    protected async _getCurrentUser(): Promise<{
        user: Schema.User
        groups: Schema.Team[]
        repos: Schema.Repository[]
    }> {
        const user   = await this.client.user.get({});
        const groups = await this.client.teams.list({ role: 'admin', pagelen: 100 });
        const repos  = await this.client.repositories.list({ username: user.data.username, pagelen: 100 });
        return { user: user.data, groups: groups.data.values, repos: repos.data.values };
    }

    public async getOwner(name: string): Promise<Owner> {
        return;
    }

    public async getCurrentUser() {
        const { user, groups, repos }    = await this._getCurrentUser();
        const repositories: Repository[] = repos.map(r => BitbucketTransformer.repository(r));
        return {
            username    : user.username.toLowerCase(),
            display_name: user.display_name,
            groups      : groups.map(group => group.username.toLowerCase()),
            repositories,
        };
    }

    async __getRepository(owner: string, slug: string) {
        const repo     = await this.client.repositories.get({ username: owner, repo_slug: slug });
        const webhooks = await this.client.repositories.listWebhooks({ username: owner, repo_slug: slug, pagelen: 100 });
        const branches = await this.client.repositories.listBranches({ username: owner, repo_slug: slug, pagelen: 100 });
        return { repo: repo.data, webhooks: webhooks.data.values, branches: branches.data.values };
    }

    public async getRepository(owner: string, slug: string): Promise<BithubRepository> {
        const { repo, branches, webhooks } = await this.__getRepository(owner, slug);
        return new BithubRepository(this, {
            ...BitbucketTransformer.repository(repo),
            webhooks: webhooks.map(hook => hook),
            branches: branches.map(branch => branch.name),
        });
    }

}
