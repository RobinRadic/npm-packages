import { shell } from './utils';

export class Services {
    static log = false;

    static async restart(name: string) {return shell(`sudo service ${name} restart`, this.log); }

    static async restartAll() {
        this.restartPhp72();
        this.restartPhp73();
        this.restartNginx();
    }

    static async restartNginx() {return this.restart('nginx'); }

    static async restartPhp72() {return this.restart('php7.2-fpm'); }

    static async restartPhp73() {return this.restart('php7.3-fpm'); }

    static async validateNginxConfig(): Promise<boolean> {
        const { error, stderr } = await shell('sudo nginx -t', this.log);
        return error === null;
    }

    static async getNginxConfigError(): Promise<string> {
        const { error, stderr } = await shell('sudo nginx -t', this.log);
        return stderr;
    }
}
