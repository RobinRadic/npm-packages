import Chain, { Rule, Use }            from 'webpack-chain';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import { Webpacker }                   from '../core/Webpacker';
import * as helpers                    from '../blocks/helpers';
import * as rules                      from '../blocks/rules';
import * as presets                    from '../blocks/presets';
import * as plugins                    from '../blocks/plugins';
import * as loaders                    from '../blocks/loaders';

export type RuleDefinition<Options> = Use<Rule> | Rule | [ Use<Rule> | Rule, Partial<Options> ]
export type RuleDefinitionFunction<Options> = (w: Webpacker, r: Rule, o: Options) => RuleDefinition<Options>
export type RuleDefinitionBlockFunction<Options> = {
    (w: Webpacker, options?: Options, ruleName?: string): Rule
    hooks?: {
        options: SyncWaterfallHook<Options>
        before: SyncHook<Rule>
        after: SyncHook<Rule>
    }
}

export type PluginDefinition<Options> = [ Chain.PluginClass | string, Partial<Options>, Chain.Plugin<Webpacker> ] | [ Chain.PluginClass | string, Partial<Options> ] | [ Chain.PluginClass ]
export type PluginDefinitionFunction<Options> = (w: Webpacker, p: Chain.Plugin<Webpacker>) => PluginDefinition<Options>
export type PluginBlockFunction<Options> = (w: Webpacker, options?: Options, pluginName?: string) => any


export type ImportedHelpers = typeof helpers
// export type Helper = keyof Helpers
export interface CustomHelpers {}
export type Helpers = ImportedHelpers & CustomHelpers

export type ImportedRules = typeof rules
export interface CustomRules {}
export type Rules = ImportedRules & CustomRules

export type ImportedPresets = typeof presets
export interface CustomPresets{}
export type Presets = ImportedPresets & CustomPresets

export type ImportedPlugins = typeof plugins
export interface CustomPlugins {}
export type Plugins = ImportedPlugins & CustomPlugins

export type ImportedLoaders = typeof loaders
export interface CustomLoaders {}
export type Loaders = ImportedLoaders & CustomLoaders

export interface Blocks {
    helpers: Helpers
    plugins: Plugins
    presets: Presets
    rules:   Rules
    loaders: Loaders
}












