export type IPhpSapi = 'cli'|'fpm'|'apache2'|string
export type IPhpVersion = '7.2'|'7.3'|'7.4'|string;
export interface IConfigPhpVersion {
    enabled?: boolean
    configPath?: string
    binPath?:string
    version?: string
    serviceName?:string
}

export interface IConfigPhp {
    versions?: IConfigPhpVersion[]
    configPath?: string
}

export interface IConfigHostfile {
    enabled?: boolean
    path?: string
}

export interface IConfigNginx {
    enabled?: boolean
    configPath?: string
    serviceName?:string
}

export interface IConfigApache {
    enabled?: boolean
    configPath?: string
    serviceName?:string
}

export interface IConfig {
    php?: IConfigPhp
    hostfile?: IConfigHostfile
    nginx?: IConfigNginx
    apache?: IConfigApache
}
