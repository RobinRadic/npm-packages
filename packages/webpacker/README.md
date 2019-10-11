Webpacker
=========

- extends [`webpack-chain`](#)
- Adds helper functions
- Provides blocks
- Installs missing dependencies
- Includes many type definitions


### extends [`webpack-chain`](#)

```ts
import Chain from 'webpack-chain'
export class Webpacker extends Chain {
    constructor(options){}
}
```


### Adds helper functions
```ts
const wp = new Webpacker({})
wp.isDev
wp.isProd
wp.isHot
wp.isServer
wp.ensureLink(src,dest)
wp.extendConfig(config => {
    config.plugins.push(new SomePlugin())
}
wp.$on
wp.$once
wp.$off
wp.$emit
wp.beforeStart(() => console.log('starting'))
wp.beforeExit(() => console.log('starting'))

```


### Provides blocks
```ts
const wp = new Webpacker({})
const {rules,plugins} = wp.blocks

rules.css(wp);
rules.scss(wp, {
    scss: {
        implementation: require('sass')
    }
});
rules.stylus(wp);
rules.images(wp);
rules.fonts(wp);
rules.vue(wp);
rules.pug(wp);

wp.module.rule('babel').test(/\.(js|mjs|jsx)$/).exclude.add(/node_modules/);
wp.module.rule('typescript').test(/\.(ts|tsx)$/).exclude.add(/node_modules/);

rules.babel(wp,{},'babel');

rules.cache(wp, {}, 'typescript')
rules.thread(wp, {}, 'typescript')
rules.babel(wp, {}, 'typescript');
rules.typescript(wp, {
    appendTsSuffixTo    : [ /.vue$/ ],
    configFile          : 'tsconfig.json',
    transpileOnly       : true,
    experimentalWatchApi: true,
    happyPackMode       : true,
    compilerOptions     : {
        target        : 'es5' as any,
        module        : 'esnext' as any,
        importHelpers : true,
        sourceMap     : wp.isDev,
        removeComments: wp.isProd
    }
});


plugins.friendlyErrors(wp);
plugins.bar(wp);
plugins.bundleAnalyzer(wp, {
    reportFilename: resolve(__dirname, 'bundle-analyzer.html')
});
plugins.vueLoader(wp);
plugins.define(wp, {
    DEV          : wp.isDev,
    PROD         : wp.isProd,
    HOT          : wp.isHot,
    ENV          : process.env.NODE_ENV,
    'process.env': {
        NODE_ENV: `"#{process.env.NODE_ENV}"`
    }
});
```

### Installs missing dependencies
```json
{
    "scripts": {
        "build": "webpack --config webpack.config.ts"
    },
    "devDependencies": {
        "@radic/webpacker": "*",
        "webpack": "*",
        "webpack-cli": "*",
        "webpack-dev-server": "*"
    }
}
```

```ts
import {Webpacker} from '@radic/webpacker'
const wp = new Webpacker({})

wp.blocks.rules.scss(wp)

export default wp.toConfig()
```

```bash
$ yarn build
- webpacker installing missing dependencies: file-loader, style-loader, sass-loader, node-sass
...
```


### Includes many type definitions
Code completion for all blocks (plugins,helpers,etc) like file-loader, rules.scss, rules.css, plugins.bar,
