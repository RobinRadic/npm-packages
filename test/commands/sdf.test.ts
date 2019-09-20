import {expect, test} from '@oclif/test'

describe('sdf', () => {
  test
    .stdout()
    .command(['sdf'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['sdf', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
