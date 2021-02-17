
import 'reflect-metadata';
import { BitbucketDriver, Bithub, bootstrap, GithubDriver, utils,Packagist } from '@radic/bithub';
import { config } from 'dotenv';
import { resolve } from 'path';

async function run() {



    config({
        path: resolve(__dirname, '../../../.env'),
    });

    const env = utils.Dot.proxied(process.env);

    const app = bootstrap({
        github   : {
            token: env.get('GITHUB_TOKEN'),
        },
        bitbucket: {
            username: env.get('BITBUCKET_USERNAME'),
            password: env.get('BITBUCKET_PASSWORD'),
        },
        packagist: {
            username: env.get('PACKAGIST_USERNAME'),
            token   : env.get('PACKAGIST_API_TOKEN'),
            url     : env.get('PACKAGIST_URL'),
        },
    });

    const bitbucket = app.get('bitbucket');

    const bh = app.get<Bithub>('bithub');
    bh.register('bb', BitbucketDriver);
    bh.register('gh', GithubDriver);


    const packagist = app.get<Packagist>('packagist')

    const list = await packagist.list()

    const bb = bh.driver('bb') as BitbucketDriver;
    const gh = bh.driver('gh') as GithubDriver;


    // const  bbuser = await bb.getCurrentUser()
    // const  ghuser = await gh.getCurrentUser()

    const bbrepo = await bb.getRepository('robinradic', 'blade-extensions')
    const ghrepo = await gh.getRepository('robinradic', 'blade-extensions')

    console.dir(list)
}

run().then(()=>{
    console.log('done');
})

