import { shell } from './utils';

export class Services {
    static log = false;

    static async start(name: string) {return shell(`sudo service ${name} start`, this.log); }

    static async stop(name: string) {return shell(`sudo service ${name} stop`, this.log); }

    static async restart(name: string) {return shell(`sudo service ${name} restart`, this.log); }

    static async status(name: string) {return shell(`sudo service ${name} status`, this.log); }

    static async statusAll(names: string[]) {
        return Promise.all(names.map(name => shell(`sudo service ${name} status`, this.log)))
    }

    static async restartAll() {
        this.restartPhp72();
        this.restartPhp73();
        this.restartPhp74();
        this.restartNginx();
    }

    static async restartNginx() {return this.restart('nginx'); }

    static async restartPhp72() {return this.restart('php7.2-fpm'); }

    static async restartPhp73() {return this.restart('php7.3-fpm'); }

    static async restartPhp74() {return this.restart('php7.4-fpm'); }

    static async validateNginxConfig(): Promise<boolean> {
        const { error, stderr } = await shell('sudo nginx -t', this.log);
        return error === null;
    }

    static async getNginxConfigError(): Promise<string> {
        const { error, stderr } = await shell('sudo nginx -t', this.log);
        return stderr;
    }
}
