import Base from '../../Base';
import { exec, execSync } from 'child_process';
import { resolve } from 'path';
import { emptyDirSync, ensureDirSync, rmdirSync, writeJSONSync } from 'fs-extra'
import { existsSync } from 'fs';
import { ReposListForOrgResponseItem } from '@octokit/rest';
import { Schema } from 'bitbucket';
import { ComposerJSON } from '../../composer.json';

const tools = exec.__promisify__

export interface RemoteRepos {
    github: ReposListForOrgResponseItem[]
    bitbucket: Schema.Repository[]
}

export default class Copy extends Base {
    static description = 'describe the command here';

    action = {
        src : { remote: 'github', owner: 'anomalylabs' },
        dest: { remote: 'bitbucket', owner: 'radic-pyro' },
    }

    async getRepos<K extends keyof RemoteRepos>(type: 'src' | 'dest'): Promise<RemoteRepos[K]> {
        let data;
        if ( this.action[ type ].remote === 'github' ) {
            let response = await this.github.repos.listForOrg({
                org     : this.action[ type ].owner,
                type    : 'private',
                per_page: 100,
            })
            data         = response.data
        } else {
            // } else if(this.action[type].remote === 'bitbucket'){
            let response = await this.bitbucket.teams.listRepositories({
                username: this.action[ type ].owner,
                pagelen : 100,
            })
            data         = response.data.values
        }
        return data;
    }

    prepareDir(dir) {
        if ( existsSync(dir) ) {
            emptyDirSync(dir)
            rmdirSync(dir);
        }
        ensureDirSync(dir);
    }

    async run() {
        await this.setup()
        const { src, dest }       = this.action
        const srcRepos            = await this.getRepos<'github'>('src')
        const srcNames: string[]  = srcRepos.map(repo => repo.name)
        const destRepos           = await this.getRepos<'bitbucket'>('dest')
        const destNames: string[] = destRepos.map(repo => repo.slug)


        let dir = resolve(__dirname, '../../../../.tmp/anomalylabs')
        this.prepareDir(dir);        let count           = 0;
        for ( const repo of srcRepos ) {
            try {
                this.log(`Starting ${repo.name}`)
                execSync(`git clone ${repo.ssh_url}`, { encoding: 'utf8', cwd: dir });
                const exec = this.createExec(resolve(dir, repo.name))
                try {
                    exec(`git branch -r | grep -v '\\->' | while read remote; do git branch --track "\${remote#origin/}" "$remote"; done`);
                } catch ( e ) {
                    this.warn(e.message)
                }
                exec(`git fetch --all`);
                exec(`git pull --all`);
                exec(`git remote rm origin`);
                exec(`git remote add origin bitbucket.org:radic-pyro/${repo.name}`);

                if ( ! destNames.includes(repo.name) ) {
                    this.log(`create bitbucket repo`)
                    const destRepo = await this.bitbucket.repositories.create({
                        username : dest.owner,
                        repo_slug: repo.name,
                        _body    : { type: 'repository', is_private: true },
                    })
                    this.log(`created bitbucket repo.  ${destRepo.data.links.html.href}`);
                }

                exec(`git push --force --all`)
                exec(`git push --force --tags`)

                this.log(`Done with ${repo.name}`)
                //git branch -r | grep -v '\->' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
            } catch ( e ) {
                this.error(`Failed: ${repo.name}  ::  ${e.message}`);
            }
            count ++;
        }

        this.log('done repos')
    }

    async createBBPackagistWebhook(username, repo_slug) {
        this.bitbucket.repositories.createWebhook({
            username, repo_slug,
            _body: {
                description: 'packages.radic.ninja',
                url        : `https://packages.radic.ninja/api/bitbucket?username=${this.settings.packagist.username}&apiToken=${this.settings.packagist.token}`,
                active     : true,
                events     : [ 'repo:push' ],
            },
        })
    }

}
