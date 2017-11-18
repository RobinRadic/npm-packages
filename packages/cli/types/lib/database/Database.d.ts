import * as Knex from 'knex';
import { Config, Migrator } from 'knex';
export declare class Database {
    protected options: Config;
    protected _knex: Knex;
    readonly knex: Knex;
    readonly migrate: Migrator;
    constructor(options?: Config);
    migrateLatest(): Promise<any>;
}
