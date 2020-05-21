import Chain, { Rule, Use } from 'webpack-chain';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import { Webpacker } from '../core/Webpacker';
import * as helpers from '../blocks/helpers';
import * as rules from '../blocks/rules';
import * as presets from '../blocks/presets';
import * as plugins from '../blocks/plugins';
import * as loaders from '../blocks/loaders';
export declare type RuleDefinition<Options> = Use<Rule> | Rule | [Use<Rule> | Rule, Partial<Options>];
export declare type RuleDefinitionFunction<Options> = (w: Webpacker, r: Rule, o: Options) => RuleDefinition<Options>;
export declare type RuleDefinitionBlockFunction<Options> = {
    (w: Webpacker, options?: Options, ruleName?: string): Rule;
    hooks?: {
        options: SyncWaterfallHook<Options>;
        before: SyncHook<Rule>;
        after: SyncHook<Rule>;
    };
};
export declare type PluginDefinition<Options> = [Chain.PluginClass | string, Partial<Options>, Chain.Plugin<Webpacker>] | [Chain.PluginClass | string, Partial<Options>] | [Chain.PluginClass];
export declare type PluginDefinitionFunction<Options> = (w: Webpacker, p: Chain.Plugin<Webpacker>) => PluginDefinition<Options>;
export declare type PluginBlockFunction<Options> = (w: Webpacker, options?: Options, pluginName?: string) => any;
export declare type ImportedHelpers = typeof helpers;
export interface CustomHelpers {
}
export declare type Helpers = ImportedHelpers & CustomHelpers;
export declare type ImportedRules = typeof rules;
export interface CustomRules {
}
export declare type Rules = ImportedRules & CustomRules;
export declare type ImportedPresets = typeof presets;
export interface CustomPresets {
}
export declare type Presets = ImportedPresets & CustomPresets;
export declare type ImportedPlugins = typeof plugins;
export interface CustomPlugins {
}
export declare type Plugins = ImportedPlugins & CustomPlugins;
export declare type ImportedLoaders = typeof loaders;
export interface CustomLoaders {
}
export declare type Loaders = ImportedLoaders & CustomLoaders;
export interface Blocks {
    helpers: Helpers;
    plugins: Plugins;
    presets: Presets;
    rules: Rules;
    loaders: Loaders;
}
