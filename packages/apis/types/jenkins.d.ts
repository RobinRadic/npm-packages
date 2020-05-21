declare module 'jenkins' {
    import { EventEmitter } from 'events';

    export interface Client extends EventEmitter {
        info(callback: (err: Error, data: any) => void): void;

        _opts: { headers: any, baseUrl: URL }

        /**
         * Add information to error
         */
        _err(err, opts)

        /**
         * Register an extension
         */
        _ext(eventName, callback)

        /**
         * Register a plugin
         */
        _plugin(plugin, options)

        /**
         * Log request events
         */
        _log(tags, data)

        /**
         * Encode
         */
        _encode(mime, value)

        /**
         * Decode
         */
        _decode(mime, value)

        /**
         * Push ext list
         */
        __push(request, name)

        /**
         * Run client request
         */
        _request(opts)

        /**
         * Run request pipeline
         */
        __pipeline(request)

        /**
         * Create HTTP request
         */
        __create(request, next)

        /**
         * Execute HTTP request
         */
        __execute(request, next)

        __shortcut(method, callerArgs)

        _options()

        _get()

        _head()

        _post()

        _put()

        _delete()

        _del()

        _patch()


    }

    export interface JenkinsAPI extends Client {
        info(callback: (err: Error, data: any) => void): void;

        build: {
            get(name: string, n: number, callback: (err: Error, data: any) => void): void;
            log(name: string, callback: (err: Error, data: any) => void): void;
            log(name: string, n: number, callback: (err: Error, data: any) => void): void;
            log(name: string, n: number, start: number, callback: (err: Error, data: any) => void): void;
            log(name: string, n: number, start: number, type: 'text' | 'html', callback: (err: Error, data: any) => void): void;
            log(name: string, n: number, start: number, type: 'text' | 'html', meta: boolean, callback: (err: Error, data: any) => void): void;
            logStream(name: string, n: number, options?: { type?: 'text' | 'html', delay?: number }): NodeJS.ReadableStream;
            stop(name: string, n: number, callback: (err: Error) => void): void;
            term(name: string, n: number, callback: (err: Error) => void): void;
        };
        job: {
            build(name: string | JobBuildOptions, callback: (err: Error, data: any) => void): void;
            build(name: string, parameters: any, callback: (err: Error, data: any) => void): void;
            build(name: string, parameters: any, token: string, callback: (err: Error, data: any) => void): void;
            config(name: string, callback: (err: Error, data: any) => void): void;
            config(name: string, xml: string, callback: (err: Error, data: any) => void): void;
            copy(name: string, from: string, callback: (err: Error) => void): void;
            create(name: string, xml: string, callback: (err: Error) => void): void;
            destroy(name: string, callback: (err: Error) => void): void;
            disable(name: string, callback: (err: Error) => void): void;
            enable(name: string, callback: (err: Error) => void): void;
            exists(name: string, callback: (err: Error, exists: boolean) => void): void;
            get(name: string, callback: (err: Error, data: any) => void): void;
            list(callback: (err: Error, data: any) => void): void;
        };
        node: {
            config(name: string, callback: (err: Error, data: any) => void): void;
            create(name: string, callback: (err: Error) => void): void;
            destroy(name: string, callback: (err: Error) => void): void;
            disconnect(name: string, callback: (err: Error) => void): void;
            disconnect(name: string, message: string, callback: (err: Error) => void): void;
            disable(name: string, callback: (err: Error) => void): void;
            disable(name: string, message: string, callback: (err: Error) => void): void;
            enable(name: string, callback: (err: Error) => void): void;
            exists(name: string, callback: (err: Error, data: boolean) => void): void;
            get(name: string, callback: (err: Error, data: any) => void): void;
            list(callback: (err: Error, data: any) => void): void;
            list(full: boolean, callback: (err: Error, data: any) => void): void;
        };
        queue: {
            list(callback: (err: Error, data: any) => void): void;
            item(n: number, callback: (err: Error, data: any) => void): void;
            cancel(n: number, callback: (err: Error) => void): void;
        };
        view: {
            config(name: string, callback: (err: Error, data: any) => void): void;
            config(name: string, xml: string, callback: (err: Error, data: any) => void): void;
            create(name: string, type: 'list' | 'my', callback: (err: Error) => void): void;
            destroy(name: string, callback: (err: Error) => void): void;
            exists(name: string, callback: (err: Error, exists: boolean) => void): void;
            get(name: string, callback: (err: Error, data: any) => void): void;
            list(callback: (err: Error, data: any) => void): void;
            add(name: string, job: string, callback: (err: Error) => void): void;
            remove(name: string, job: string, callback: (err: Error) => void): void;
        };

    }

    export namespace ApiResponse {
        export interface Base extends Record<string, any> {

        }

        export interface Job extends Base {
            _class?: string;
            actions?: Scm[];
            description?: string;
            displayName?: string;
            displayNameOrNull?: null;
            fullDisplayName?: string;
            fullName?: string;
            name?: string;
            url?: string;
            buildable?: boolean;
            builds?: Build[];
            color?: string;
            firstBuild?: Build;
            healthReport?: HealthReport[];
            inQueue?: boolean;
            keepDependencies?: boolean;
            lastBuild?: Build;
            lastCompletedBuild?: Build;
            lastFailedBuild?: Build;
            lastStableBuild?: Build;
            lastSuccessfulBuild?: Build;
            lastUnstableBuild?: null;
            lastUnsuccessfulBuild?: Build;
            nextBuildNumber?: number;
            property?: any[];
            queueItem?: null;
            concurrentBuild?: boolean;
            downstreamProjects?: any[];
            labelExpression?: null;
            scm?: Scm;
            upstreamProjects?: any[];
        }

        export interface Build extends Base {
            _class?: string;
            actions?: Action[];
            artifacts?: any[];
            building?: boolean;
            description?: null;
            displayName?: string;
            duration?: number;
            estimatedDuration?: number;
            executor?: null;
            fullDisplayName?: string;
            id?: string;
            keepLog?: boolean;
            number?: number;
            queueId?: number;
            result?: string;
            timestamp?: number;
            url?: string;
            builtOn?: string;
            changeSet?: ChangeSet;
            culprits?: any[];
        }

        export interface Action {
            _class?: string;
            causes?: Cause[];
            buildsByBranchName?: BuildsByBranchName;
            lastBuiltRevision?: LastBuiltRevision;
            remoteUrls?: string[];
            scmName?: string;
        }

        export interface BuildsByBranchName {
            'refs/remotes/origin/master'?: RefsRemotesOriginMaster;
        }

        export interface RefsRemotesOriginMaster {
            _class?: string;
            buildNumber?: number;
            buildResult?: null;
            marked?: LastBuiltRevision;
            revision?: LastBuiltRevision;
        }

        export interface LastBuiltRevision {
            SHA1?: string;
            branch?: Branch[];
        }

        export interface Branch {
            SHA1?: string;
            name?: string;
        }

        export interface Cause {
            _class?: string;
            shortDescription?: string;
            userId?: string;
            userName?: string;
        }

        export interface ChangeSet {
            _class?: string;
            items?: any[];
            kind?: string;
        }

        export interface Scm {
            _class?: string;
        }

        export interface Build {
            _class?: string;
            number?: number;
            url?: string;
        }

        export interface HealthReport {
            description?: string;
            iconClassName?: string;
            iconUrl?: string;
            score?: number;
        }

    }

    export interface JenkinsPromisifiedAPI extends Client {
        info(): Promise<any>;

        build: {
            get(name: string, n: number): Promise<ApiResponse.Build>;
            log(name: string, n: number, start?: number, type?: 'text' | 'html', meta?: boolean): Promise<any>;
            logStream(name: string, n: number, type?: 'text' | 'html', delay?: number): Promise<any>;
            stop(name: string, n: number): Promise<void>;
            term(name: string, n: number): Promise<void>;
        };
        // @ts-ignore
        job: {
            build(name: string, parameters?: any, token?: string): Promise<any>;
            build(opts: JobBuildOptions): Promise<any>;
            config(name: string, xml?: string): Promise<any>;
            copy(name: string, from: string): Promise<void>;
            create(name: string, xml: string): Promise<void>;
            destroy(name: string): Promise<void>;
            disable(name: string): Promise<void>;
            enable(name: string): Promise<void>;
            exists(name: string): Promise<boolean>;
            get(name: string): Promise<ApiResponse.Job>;
            list(): Promise<ApiResponse.Base[]>;
        };
        node: {
            config(name: string): Promise<any>;
            create(name: string): Promise<void>;
            destroy(name: string): Promise<void>;
            disconnect(name: string, message?: string): Promise<void>;
            disable(name: string, message?: string): Promise<void>;
            enable(name: string): Promise<void>;
            exists(name: string): Promise<boolean>;
            get(name: string): Promise<any>;
            list(full?: boolean): Promise<any>;
        };
        queue: {
            list(): Promise<any>;
            item(n: number): Promise<any>;
            cancel(n: number): Promise<void>;
        };
        view: {
            config(name: string, xml?: string): Promise<any>;
            create(name: string, type: 'list' | 'my'): Promise<void>;
            destroy(name: string): Promise<void>;
            exists(name: string): Promise<boolean>;
            get(name: string): Promise<any>;
            list(): Promise<any>;
            add(name: string, job: string): Promise<void>;
            remove(name: string, job: string): Promise<void>;
        };


    }

    export interface JobBuildOptions {
        name: string;
        parameters?: any;
        token?: string;
    }

    export interface JenkinsClientOptions {
        baseUrl?: string;
        crumbIssuer?: boolean;
        headers?: any;
        promisify?: boolean | ((...args: any[]) => any);
    }


    export default function create(opts?: {
        baseUrl?: string;
        crumbIssuer?: boolean;
        headers?: any;
        promisify?: false;
    }): JenkinsAPI;
    export default function create(opts: {
        baseUrl?: string;
        crumbIssuer?: boolean;
        headers?: any;
        promisify: true;
    }): JenkinsPromisifiedAPI;

}
