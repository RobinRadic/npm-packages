import * as helpers from './helpers';
import * as plugins from './plugins';
import * as presets from './presets';
import * as rules   from './rules';
import * as loaders from './loaders';
import { Blocks }   from '../interfaces';

export const blocks: Blocks = {
    helpers,
    plugins,
    presets,
    rules,
    loaders
};
