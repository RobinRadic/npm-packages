@radic/bitbucket
================

Bitbucket

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@radic/bitbucket.svg)](https://npmjs.org/package/@radic/bitbucket)
[![Downloads/week](https://img.shields.io/npm/dw/@radic/bitbucket.svg)](https://npmjs.org/package/@radic/bitbucket)
[![License](https://img.shields.io/npm/l/@radic/bitbucket.svg)](https://github.com/RobinRadic/bitbucket/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @radic/bitbucket
$ bb COMMAND
running command...
$ bb (-v|--version|version)
@radic/bitbucket/1.0.0 linux-x64 node-v10.16.0
$ bb --help [COMMAND]
USAGE
  $ bb COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bb gh`](#bb-gh)
* [`bb help [COMMAND]`](#bb-help-command)
* [`bb list [FILE]`](#bb-list-file)
* [`bb login [FILE]`](#bb-login-file)
* [`bb me`](#bb-me)
* [`bb repo:copy`](#bb-repocopy)
* [`bb repo:create [FULL_NAME]`](#bb-repocreate-full_name)
* [`bb repo:list [OWNER]`](#bb-repolist-owner)
* [`bb repo:packagist [USERNAME] [REPO_SLUG]`](#bb-repopackagist-username-repo_slug)
* [`bb teams`](#bb-teams)

## `bb gh`

describe the command here

```
USAGE
  $ bb gh
```

_See code: [src/commands/gh.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/gh.ts)_

## `bb help [COMMAND]`

display help for bb

```
USAGE
  $ bb help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `bb list [FILE]`

describe the command here

```
USAGE
  $ bb list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ bb hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/list.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/list.ts)_

## `bb login [FILE]`

Login to bitbucket

```
USAGE
  $ bb login [FILE]

OPTIONS
  -P, --password=password  The password to use
  -U, --username=username  The username to use
```

_See code: [src/commands/login.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/login.ts)_

## `bb me`

Show the current authenticated user

```
USAGE
  $ bb me
```

_See code: [src/commands/me.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/me.ts)_

## `bb repo:copy`

describe the command here

```
USAGE
  $ bb repo:copy
```

_See code: [src/commands/repo/copy.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/repo/copy.ts)_

## `bb repo:create [FULL_NAME]`

Create a repository

```
USAGE
  $ bb repo:create [FULL_NAME]

OPTIONS
  -P, --private  Create a private repository
```

_See code: [src/commands/repo/create.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/repo/create.ts)_

## `bb repo:list [OWNER]`

List repositories

```
USAGE
  $ bb repo:list [OWNER]
```

_See code: [src/commands/repo/list.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/repo/list.ts)_

## `bb repo:packagist [USERNAME] [REPO_SLUG]`

describe the command here

```
USAGE
  $ bb repo:packagist [USERNAME] [REPO_SLUG]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/repo/packagist.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/repo/packagist.ts)_

## `bb teams`

List your teams

```
USAGE
  $ bb teams
```

_See code: [src/commands/teams.ts](https://github.com/RobinRadic/bitbucket/blob/v1.0.0/src/commands/teams.ts)_
<!-- commandsstop -->
