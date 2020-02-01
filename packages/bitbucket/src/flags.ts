import { flags } from '@oclif/command';

export const username = flags.build({
    char: 'U',
    name: 'username',
    description: 'The username to use'
})

export const password = flags.build({
    char: 'P',
    name: 'password',
    description: 'The password to use'
})

export const token = flags.build({
    char: 'T',
    name: 'token',
    description: 'The token to use'
})