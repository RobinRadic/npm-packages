export interface AuthConfig {
    username?:string
    password?:string
    token?:string
}



export namespace Bithub {

    export interface Webhook {

    }
    export interface Branch {
        hasComposerFile()
        getComposerFile()
    }
    export interface Repository {
        webhooks: Webhook[]
        branches: Branch[]
        mainBranch: Branch

        createWebhook()
        hasComposerFile()
        getComposerFile()
    }

    export interface Owner {
        username: string

        getRepositories(): Promise<Record<string, Repository>>
        createRepository()

    }

    export interface Driver {
        getOwner(owner: String): Promise<Owner>

        getRepositories()
    }
}