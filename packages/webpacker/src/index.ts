///<reference path="../typings/webpack.d.ts"/>
///<reference path="../typings/webpack-chain.d.ts"/>
///<reference path="../typings/modules.d.ts"/>
///<reference path="../typings/globals.d.ts"/>

import 'reflect-metadata'
import * as interfaces from './interfaces';
import { Webpacker }   from './core/Webpacker';

export * from './core/Webpacker';
export * from './core/Log';
export * from './core/Dependencies';
export * from './core/Config';

export * from './blocks';
export * from './loaders';
export * from './plugins';

// const { presets, rules, helpers, plugins, loaders } = blocks;
// export { blocks, presets, rules, helpers, plugins, loaders };

export { interfaces };

export * from './utils/camel2dash';
export * from './utils/findUpAll';


export default Webpacker

// sdf
