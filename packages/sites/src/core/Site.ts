export class Site {
    serverMode: 'nginx' | 'nginx-apache' | 'apache';

    get hasNginxConfig() {return this.serverMode === 'nginx' || this.serverMode === 'nginx-apache';}

    get hasApacheConfig() {return this.serverMode === 'apache' || this.serverMode === 'nginx-apache';}



}
