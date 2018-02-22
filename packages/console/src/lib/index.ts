import "reflect-metadata";
import { resolve } from "path";
import { config } from 'dotenv'

import {timelog} from './utils/debug'

timelog('console:lib:index:import')
config({
    path: resolve(__dirname, '../.env')
})

import { container } from './core/Container';
import { nullLogModule } from './modules/log';
container.load(nullLogModule);

timelog('console:lib:index:import', 'utils')
import './utils'
timelog('console:lib:index:import', 'core')
import './core'
timelog('console:lib:index:import', 'modules/log')
import './modules/log'
timelog('console:lib:index:export')

export { LoggerInstance } from 'winston'
export * from './interfaces'
export * from './errors'

timelog('console:lib:index:export', 'core')
export * from './core'

timelog('console:lib:index:export', 'utils')
export * from './utils'

timelog('console:lib:index:export', 'decorators')
export * from './decorators'

timelog('console:lib:index:export', 'defaults')
export * from './defaults'

timelog('console:lib:index:export', 'commands')
export * from './commands'

timelog('console:lib:index:export', 'modules/completion')
export * from './modules/completion'

timelog('console:lib:index:export', 'modules/help')
export * from './modules/help'

timelog('console:lib:index:export', 'modules/input')
export * from './modules/input'

timelog('console:lib:index:export', 'modules/log')
export * from './modules/log'

timelog('console:lib:index:export', 'modules/output')
export * from './modules/output'

timelog('console:lib:index:export', 'modules/verbose')
export * from './modules/verbose'

timelog('console:lib:index:exported')