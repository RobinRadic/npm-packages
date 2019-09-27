import { Bithub } from './Bithub';
import { BithubRepository } from './responses';

export interface Repository {
    slug: string
    full_name: string
    private: boolean
    owner: string
    default_branch: string
    urls: {
        ssh: string
        https: string
    }

}

export interface FullRepository extends Repository {
    webhooks: any[]
    branches: any[]
}

export interface Owner {
    repositories: string[]

    getRepository()
}

export interface User {
    display_name: string
    username: string
    groups: string[]
    repositories: Repository[]
}

export interface Api {
    getCurrentUser(): Promise<User>

    getRepository(owner: string, slug: string): Promise<BithubRepository>

    getOwner(name: string): Promise<Owner>
}

export interface DriverClass {
    new(...params): Driver
}

export interface Driver {
    driver(name: string): Driver

    bithub: Bithub
    name?: string
}

export interface ApiDriver extends Driver, Api {

}
