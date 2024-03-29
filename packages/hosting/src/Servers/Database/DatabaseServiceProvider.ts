import { ServiceProvider } from '@radic/shared';

import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import { DatabaseManager } from './DatabaseManager';
import { DatabasesConfiguration } from './types';
import { decorate, injectable } from '@radic/core';
import { ConnectionManager } from 'typeorm';
import { ConnectionHelper } from './ConnectionHelper';

export { ConnectionOptions };


declare module '@radic/core/types/Foundation/Application' {
    export interface Application {
        db: DatabaseManager;
    }

    export interface Bindings {
        db: DatabaseManager;
    }
}
decorate(injectable(),ConnectionManager)

export class DatabaseServiceProvider extends ServiceProvider {

    load() {
        this.config<DatabasesConfiguration>({
            key     : 'hosting.db',
            defaults: {
                connectOnBoot: [],
                main         : null,
                connections  : {
                    bettersqlite3: [],
                    mongo        : [],
                    mysql        : [],
                    postgres     : [],
                    sql          : [],
                    sqlite       : [],
                },
            },
        });
    }

    register() {
        this.app.singleton('db', DatabaseManager).addBindingGetter('db');
        this.app.singleton('db.connections', ConnectionManager)
        this.app.singleton('db.helper',ConnectionHelper)
    }

    async boot() {
        this.app.db.updateConnections()
        await Promise.all(this.app.config.hosting.db.connectOnBoot.map(name => this.app.db.connect(name)));
    }
}
