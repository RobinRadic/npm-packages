import { logColors, logLevel, logLevels } from './static';
import { logTransports } from './transports';
import { Log, LogLevel } from './interfaces';
declare function setLogLevel(level: LogLevel): void;
declare function setVerbosity(verbosity: number): void;
export { Log, LogLevel, logColors, setLogLevel, setVerbosity, logLevels, logLevel, logTransports };
