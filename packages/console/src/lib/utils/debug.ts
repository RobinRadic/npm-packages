import * as _debug from 'debug';


export function debug(namespace:string):_debug.IDebugger {
    return _debug(namespace);
}

export function timelog(name:string, ...args:any[]):typeof timelog{
    debug('timelog:' + name)(process.uptime(), args)
    return timelog
}