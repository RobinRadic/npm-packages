///<reference path="../../types/jenkins.d.ts"/>

import createJenkinsApi, { JenkinsPromisifiedAPI } from 'jenkins';

export interface JenkinsOptions {
    crumbIssuer?: boolean;
    url: string
    username: string
    password: string
}

export class Jenkins {
    api: JenkinsPromisifiedAPI;
    info: any;

    constructor(protected options?: JenkinsOptions) { }

    get valid() {
        if ( this.api ) {
            return true;
        }
        if ( !this.options || !this.options.username || !this.options.password || !this.options.url ) {
            return false;
        }

        try {
            let url      = new URL(this.options.url);
            url.username = this.options.username;
            url.password = this.options.password;

            this.api = createJenkinsApi({
                baseUrl    : url.toString(),
                promisify  : true,
                crumbIssuer: this.options.crumbIssuer,
            });

        } catch ( e ) {
            return false;
        }
        return true;
    }

    connected: boolean = false;
    crumbIssuer: { crumbRequestField: string, crumb: string };

    async connect() {
        if ( !this.connected && this.valid ) {
            this.info        = await this.api.info();
            this.crumbIssuer = await this.api[ 'crumbIssuer' ].get();
            // this.api._opts.headers[ this.crumbIssuer.crumbRequestField ] = this.crumbIssuer.crumb;
            this.connected   = true;
        }
    }
}
