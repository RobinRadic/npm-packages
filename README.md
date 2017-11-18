Radic's NPM Packages
====================

This repository contains some of my public **non browser/DOM** node packages.

Go to [documentation](http://robin.radic.nl/npm-packages) for all packages,

- [Radic's NPM Packages](#radics-npm-packages)
  * [Summary](#summary)
  * [Development](#development)
    + [Primary toolset](#primary-toolset)
    + [Run Tasks](#run-tasks)
    + [Gulp tasks](#gulp-tasks)

Summary
-------
- All packages are prefixed/scoped under **@radic**
- Typescript only
- Opinionated structure and workflow
- Automation as much as possible, including docs, gh-pages, etc
- Individual package versions. Aims to follow [Semantic version](http://semver.org/) as much as possible.


Development
-----------
### Primary toolset
- Lerna
    - Includes example for extending it's CLI, extending commands or adding new ones.
- Typescript (NodeJS configuration)
- Typedoc
- Mocha, Mocha Typescript, Chai
- Gulp, optionally with:
    - Automatic Typescript packages task builder (clean,build,watch) for both `src` and `test`
    - IntelliJ IDEA (php/webstorm) helper task for fixing / configuring Typescript stuff
- IntelliJ IDEA (php/webstorm) run configurations
    - Debugging Typescript code using ts-node
    - Debugging/running Gulp using ts-node

### Run Tasks
- `yarn start` : Installs, bootstraps, links and build all packages.
- `yarn clean` : Cleans everything; docs, node_modules, package build js. Can only be reversed by `yarn start`
- `yarn build` : Builds source and tests files for all packages
- `yarn watch` : Watches all source and test files and builds on change
- `yarn docs`  : Generates typedoc for all packages and compiles the index.html file inside `docs/`
- `yarn docs:serve` : Creates a static server inside `docs/` and watches all template related files. Run `yarn docs` first.
- `yarn docs:deploy` : Runs `yarn docs` then deploys `docs/` to `gh-pages` (located at https://robin.radic.nl/npm-packages)
- `yarn scan` : Scans all node modules for security vulnerabilities.
- `yarn test` : Tests all packages. Run `yarn build` or `yarn watch` first.
- `yarn lerna`: Starts `lerna-wizard`, a interactive tool to execute Lerna commands.


### Gulp tasks
- `gulp -T` for a complete useless overview.
- `gulp tasks` for a better overview.
- `gulp idea` : If using any IntelliJ product (IDEA,php/webstorm). This adds all source, tests, exclusions paths. Fixes some anoyances and improves intellisence.
- `gulp tasks -d 3` : The higher the number gives more tasks for fine picking of tasks. Its better not to use them directly.
