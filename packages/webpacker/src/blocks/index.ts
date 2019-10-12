import * as helpers from './helpers';
import * as plugins from './plugins';
import * as presets from './presets';
import * as rules from './rules';
import * as loaders from './loaders';

export type ImportedHelpers = typeof helpers
// export type Helper = keyof Helpers
export interface Helpers {}

export type ImportedRules = typeof rules
export interface Rules {}

export type ImportedPresets = typeof presets
export interface Presets{}

export type ImportedPlugins = typeof plugins
export interface Plugins {}

export type ImportedLoaders = typeof loaders
export interface Loaders {}

export interface Blocks {
    helpers: ImportedHelpers & Helpers
    plugins: ImportedPlugins & Plugins
    presets: ImportedPresets & Presets
    rules:   ImportedRules & Rules
    loaders: ImportedLoaders & Loaders
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
