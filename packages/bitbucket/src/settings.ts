import { Settings } from './utils/Settings';
// noinspection ES6UnusedImports
import Bitbucket, { Schema } from 'bitbucket'
// noinspection ES6UnusedImports
import Github, { UsersGetAuthenticatedResponse } from '@octokit/rest'

export interface ISettings {
    github?: {
        token?: string
        user?: UsersGetAuthenticatedResponse
        connection?: Github.Options
    }
    bitbucket?: {
        username?: string
        password?: string
        user?: Bitbucket.Schema.User
        connection?: Bitbucket.Options
    }
    packagist?: {
        username?: string
        token?: string
        url?:string
    }
}

let settings = Settings.proxied<ISettings>({
    github   : {},
    bitbucket: {},
    packagist: {},
})

export function getSettings() {
    loadSettings();
    return settings;
}

let loaded = false

export function loadSettings() {
    if ( loaded ) {
        return
    }
    const env = Settings.loadDotEnv()
    settings.set('github.token', env.get('GITHUB_TOKEN'))
    settings.set('bitbucket.username', env.get('BITBUCKET_USERNAME'))
    settings.set('bitbucket.password', env.get('BITBUCKET_PASSWORD'))
    settings.set('packagist.username', env.get('PACKAGIST_USERNAME'))
    settings.set('packagist.token', env.get('PACKAGIST_API_TOKEN'))
    settings.set('packagist.url', env.get('PACKAGIST_URL'))
    loaded = true;
}