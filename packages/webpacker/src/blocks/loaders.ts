import { Webpacker } from '../Webpacker';
import { Rule } from 'webpack-chain';
import { SaveContentLoaderOptions } from '../loaders/save-content-loader';
import { CustomLoaders } from '../loaders';


export const saveContent = Webpacker.wrap((wp:Webpacker, rule:string|Rule, options:SaveContentLoaderOptions) => {
    rule = typeof rule === 'string' ? wp.module.rule(rule) : rule
    return rule.use('save-content-loader').loader(CustomLoaders.saveContent).options(options)
})
