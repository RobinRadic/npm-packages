import * as knex from 'knex';

export const up = (knex: knex, Promise) => {
    knex.schema.createTable('SSHConnections', (table) => {
        table.increments();
        table.string('name').unique()
        table.string('user')
        table.string('host')
        table.string('method')
        table.string('password')
        table.string('localPath')
        table.string('hostPath')
        table.integer('port')
    })
}

export const down = (knex: knex, Promise) => {
    knex.schema.dropTableIfExists('SSHConnections')
}