import { server }      from './server';
import { UserStorage } from './UserStorage';
import { Server }      from 'http';

export function start(port: number = 8877, hostname: string = '10.0.0.10'): Promise<Server> {
    //UserStorage.dirName = 'homey-server';
    UserStorage.ensureDir();
    return new Promise((resolve, reject) => {
        server.listen(port, hostname, () => {
            resolve(server);
        });
    });
}

