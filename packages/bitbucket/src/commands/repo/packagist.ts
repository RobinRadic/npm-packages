import Base from '../../Base';
import { execSync } from 'child_process';
import { flags } from '@oclif/command';
import { Ask } from '../../ask';
import { ComposerJSON } from '../../composer.json';
import { IArg } from '@oclif/parser/lib/args';
import { Schema } from 'bitbucket'

export default class PackagistHook extends Base {
    static description  = 'describe the command here';
    static flags        = { help: flags.help({ char: 'h' }) }// name : flags.string({ char: 'n', descr0iption: 'name to print' }), // flag with a value (-n, --name=VALUE)// force: flags.boolean({ char: 'f' }), // flag with no value (-f, --force)
    static args: IArg[] = [
        { name: 'username' },
        { name: 'repo_slug' },
    ];

    async run() {
        await this.setup()
        const isio                  = this.interactive
        const { args, flags }       = this.parse(this.constructor)
        let { username, repo_slug } = args

        let repoSlugs = [ repo_slug ];

        if ( ! username ) {
            const usernames = await this.bitbucket.teams.list({ pagelen: 100, role: 'admin' });
            const names     = usernames.data.values.map(team => ({
                message: '',
                name   : team.username,
            }));
            username        = await Ask.list('You have not provided a user/team.', names);
        }

        if ( username && ! repo_slug ) {

            const repos      = await this.bitbucket.repositories.list({
                username: username,
                pagelen : 100, // limit for dev
                //pagelen:100
            })
            let allRepoSlugs = repos.data.values.map(repo => repo.slug);

            let choice = 'all';
            if ( isio ) {
                choice = await Ask.list('You have provided a username without a repo. What do you want to do?', [
                    { name: 'all', message: 'Create hook for all compatible repositories', default: true },
                    { name: 'include', message: 'Select repositories to hook include with hooking' },
                    { name: 'exclude', message: 'Select repositories to exclude with hooking' },
                    { name: 'select', message: 'Select repository to hook' },
                ]);
            }
            this.debug({ choice, repoSlugs, allRepoSlugs });

            if ( choice === 'all' ) {
                repoSlugs = allRepoSlugs
            }
        }

        for ( let repoSlug of repoSlugs ) {
            let response: any = await this.bitbucket.repositories.get({ username, repo_slug: repoSlug })
            const repo        = response.data;

            this.log('Ensuring repo added to packagist', repo.full_name)
            response = await this.addRepoToPackagist(repo)
            response === null ? this.log('Repo was already added', repo.fullList) : this.log('Repo was added to packagist', repo.fullList)

            this.log('Ensuring repo webhook to packagist', repo.full_name)
            response = await this.hookRepoToPackagist(repo)
            response === null ? this.log('Webhook was already added', repo.fullList) : this.log('Repo webhook to packagist was added', repo.fullList)
        }

        this.log('done repos')
    }

    async addRepoToPackagist(repo: Schema.Repository) {
        const composer = await this.getRepoComposer(repo)
        if ( ! composer ) {
            return;
        }
        const [ vendor, name ] = composer.name.split('/')
        const hasPackage       = await this.packagist.hasPackage(vendor, name)
        if ( hasPackage ) {
            return;// this.log('hasPackage. Skipping', username, repo_slug, '   with package', composer.name)
        }
        let index = repo.links.clone.findIndex(clone => clone.name === 'ssh')
        if ( index === - 1 ) {
            index = repo.links.clone.length - 1
        }
        const url      = repo.links.clone[ index ].href;
        const response = await this.packagist.addPackage(url)
    }

    async hookRepoToPackagist(repo: Schema.Repository) {
        const webhooks = await this.bitbucket.repositories.listWebhooks({
            username: repo.owner.username, repo_slug: repo.slug, pagelen: 100,
        })
        for ( const webhook of webhooks.data.values ) {
            if ( webhook.active === true && webhook.url.startsWith(this.settings.packagist.url) ) {
                return;
            }
        }
        const webhook = await this.bitbucket.repositories.createWebhook({
            username: repo.owner.username, repo_slug: repo.slug,
            _body   : {
                description: this.settings.packagist.url,
                url        : `${this.settings.packagist.url}/api/bitbucket?username=${this.settings.packagist.username}&apiToken=${this.settings.packagist.token}`,
                active     : true,
                skip_cert_verification:true,
                history_enabled:true,
                events     : [ 'repo:push' ],
            },
        })

        return webhook.data
    }

    async getRepoComposer(repo: Schema.Repository): Promise<ComposerJSON> {
        try {
            const content = await this.bitbucket.getFileContent({
                username : repo.owner.username,
                repo_slug: repo.slug,
                node     : repo.mainbranch.name,
                path     : 'composer.json',
            })
            if ( ! content ) {
                return this.debug('skipping', repo.owner.username, repo.slug) as any;
            }
            const composer: ComposerJSON = JSON.parse(content);
            // const [ vendor, name ]       = composer.name.split('/')
            return composer;
        } catch ( e ) {
            return null
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


//
// const { src, dest }       = this.action
// const srcRepos            = await this.getRepos<'github'>('src')
// const srcNames: string[]  = srcRepos.map(repo => repo.name)
// const destRepos           = await this.getRepos<'bitbucket'>('dest')
// const destNames: string[] = destRepos.map(repo => repo.slug)
//
// let ops: Array<{ dest: { remote: string, owner: string, repo: string }, package: { vendor: string, slug: string } }> = [];
//
// for ( const srcName of srcNames ) {
//     let downloadResponse       = await this.github.repos.getContents({
//         owner: src.owner,
//         repo : srcName,
//         path : 'composer.json',
//     });
//     let composerJson           = (new Buffer(downloadResponse.data[ 'content' ], 'base64')).toString('ascii');
//     let composer: ComposerJSON = JSON.parse(composerJson);
//     ops.push({
//         dest   : { ...dest, repo: srcName },
//         package: {
//             vendor: composer.name.split('/')[ 0 ],
//             slug  : composer.name.split('/')[ 1 ],
//         },
//     })
// }
//
// for ( const op of ops ) {
//     let hasPackage = await this.packagist.hasPackage(op.package.vendor, op.package.slug);
//     if(hasPackage){
//         continue;
//     }
//
// }
//
// const pkg   = await this.packagist.getPackage('crfvs', 'legacy');
// const pkg2  = await this.packagist.getPackage('crvs', 'legacy');
// const pkgs  = await this.packagist.list();
// const pkgs2 = await this.packagist.list({ type: 'library' });
// const pkgs3 = await this.packagist.list({ vendor: 'crvs' });
//
// let dir = resolve(__dirname, '../../../../.tmp/anomalylabs')
// this.prepareDir(dir);
// writeJSONSync(resolve(dir, 'repos.json'), srcRepos)
//
