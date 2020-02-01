import Base from '../Base';
import { exec, execSync } from 'child_process';
import { resolve } from 'path';
import { emptyDirSync, ensureDirSync, rmdirSync, writeJSONSync } from 'fs-extra'
import { existsSync } from 'fs';
import { ReposListForOrgResponseItem } from '@octokit/rest';
import { Schema } from 'bitbucket';
import { ComposerJSON } from '../composer.json';

const tools = exec.__promisify__

export interface RemoteRepos {
    github: ReposListForOrgResponseItem[]
    bitbucket: Schema.Repository[]
}

export default class Gh extends Base {
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

        let ops: Array<{ dest: { remote: string, owner: string, repo: string }, package: { vendor: string, slug: string } }> = [];

        for ( const srcName of srcNames ) {
            let downloadResponse       = await this.github.repos.getContents({
                owner: src.owner,
                repo : srcName,
                path : 'composer.json',
            });
            let composerJson           = (new Buffer(downloadResponse.data[ 'content' ], 'base64')).toString('ascii');
            let composer: ComposerJSON = JSON.parse(composerJson);
            ops.push({
                dest   : { ...dest, repo: srcName },
                package: {
                    vendor: composer.name.split('/')[ 0 ],
                    slug  : composer.name.split('/')[ 1 ],
                },
            })
        }

        for ( const op of ops ) {
            let hasPackage = await this.packagist.hasPackage(op.package.vendor, op.package.slug);
            if(hasPackage){
                continue;
            }

        }

        const pkg   = await this.packagist.getPackage('crfvs', 'legacy');
        const pkg2  = await this.packagist.getPackage('crvs', 'legacy');
        const pkgs  = await this.packagist.list();
        const pkgs2 = await this.packagist.list({ type: 'library' });
        const pkgs3 = await this.packagist.list({ vendor: 'crvs' });

        let dir = resolve(__dirname, '../../../../.tmp/anomalylabs')
        this.prepareDir(dir);
        writeJSONSync(resolve(dir, 'repos.json'), srcRepos)


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

    async clone(dir, srcRepos: any[], destNames: string[]) {
        const { src, dest } = this.action
        let count           = 0;
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
    }

    createExec(cwd) {
        return (command, log = true) => {
            if ( log ) {
                this.log(command)
            }
            execSync(command, { encoding: 'utf8', cwd });
        }
    }
}
