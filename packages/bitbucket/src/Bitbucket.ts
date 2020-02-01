import BaseBitbucket, { Options } from 'bitbucket'


export interface RequestOptions extends Options {

    accepts?: any
    body?: any
    method?: string
    url?: string
}

export interface Bitbucket {
    request(options: RequestOptions): Promise<any>
}

export interface GetFileContentOptions {
    username: string
    repo_slug: string
    node?: string
    path: string
}

export class Bitbucket extends BaseBitbucket {

    async getFileContent(opts: GetFileContentOptions): Promise<string> {
        if ( ! opts.node ) {
            const repository = await this.repositories.get({
                username : opts.username,
                repo_slug: opts.repo_slug,
            })
            opts.node=repository.data.mainbranch.name
        }
        try {
            const file           = await this.source.read({
                username : opts.username,
                repo_slug: opts.repo_slug,
                node     : opts.node,
                path     : opts.path,
                format   : 'meta',
            }) as any
            let fileHref: string = file.data.links.self.href;
            let url              = fileHref.replace('https://api.bitbucket.org/2.0', '');
            const response       = await this.request({ url })
            return response.data;
        } catch(e){
            console.warn(e)
        }
        return null;
    }
}