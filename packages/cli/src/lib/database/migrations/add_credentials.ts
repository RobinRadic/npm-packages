import * as knex from 'knex';

export const up = (knex: knex, Promise) => {
    knex.schema.createTable('Credentials', (table) => {
        table.increments();
        table.string('name')
        table.string('service')
        table.string('method')
        table.string('key')
        table.string('secret')
        table.text('extra')
        table.boolean('default_for_service')
    })
}

export const down = (knex: knex, Promise) => {
    knex.schema.dropTableIfExists('Credentials')
}