///<reference path="globals.d.ts"/>
///<reference path="modules.d.ts"/>

import { CustomLoaders } from './loaders';
import SizePlugin from './plugins/SizePlugin';
import ScssVariableToTypescript from './plugins/scss-variables-to-typescript';
import JsonPlugin from './plugins/JsonPlugin';
import ExtraTemplatedPathsPlugin from './plugins/ExtraTemplatedPathsPlugin';
import { blocks } from './blocks';
import * as interfaces from './interfaces';

export * from './Webpacker';
export * from './Log';
export * from './yarn';

const { presets, rules, helpers, plugins, loaders } = blocks;
export { blocks, presets, rules, helpers, plugins, loaders };

export { CustomLoaders, SizePlugin, ScssVariableToTypescript, JsonPlugin, ExtraTemplatedPathsPlugin, interfaces };

export * from './utils/createConfig';
export * from './utils/camel2dash';
export * from './utils/findUpAll';

