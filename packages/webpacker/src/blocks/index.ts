import * as helpers from './helpers';
import * as plugins from './plugins';
import * as presets from './presets';
import * as rules from './rules';
import * as loaders from './loaders';

export type Helpers = typeof helpers
export type Helper = keyof Helpers

export type Rules = typeof rules
export type Rule = keyof Rules

export type Presets = typeof presets
export type Preset = keyof Presets

export type Plugins = typeof plugins
export type Plugin = keyof Plugins

export type Loaders = typeof loaders
export type Loader = keyof Loaders

export type BlockKeys = Helper | Rule | Preset | Plugin | Loader
export type BlockValues = Helpers & Rules & Presets & Plugins & Loaders

export interface Blocks {
    helpers: Helpers
    plugins: Plugins
    presets: Presets
    rules: Rules
    loaders:Loaders
}

// export type Blocks = {
//     [k in Helper]: Helpers[k]
// } & {
//     [k in Rule]: Rules[k]
// } & {
//     [k in Preset]: Presets[k]
// } & {
//     [k in Plugin]: Plugins[k]
// } & IBlocks


export const blocks: Blocks = {
    helpers,
    plugins,
    presets,
    rules,
    loaders
};
