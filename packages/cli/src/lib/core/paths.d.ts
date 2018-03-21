export interface Paths {
    root: string;
    prefix: string;
    home: string;
    cwd: string;
    env: string;
    bin: string;
    src: string;
    packageFile: string;
    tsconfig: string;
    tsd: string;
    user: string;
    logFile: string;
    rcFile: string;
    userData: string;
    userCache: string;
    userDatabase: string;
    userDataConfig: string;
    userSecretKeyFile: string;
    userPublicKeyFile: string;
    backups: string;
    dbBackups: string;
}
export declare function setPermissions(paths: any): void;
export declare let paths: Paths;
export declare function setPaths(overrides?: any, _root?: string, _prefix?: string, directory?: string): Paths;
