
declare module 'tonto' {

    namespace Tonto {

        export interface TontoInstance extends Directives {
            render(): string
        }

        export interface TontoConstructor {
            new(...params): TontoInstance
        }

        export interface DirectiveFn {
            (value: any): Directives

            (value: any, block: Function): Directives
        }

        export interface Directives {
            acceptFilter: DirectiveFn
            acceptPathInfo: DirectiveFn
            accessFileName: DirectiveFn
            action: DirectiveFn
            addAlt: DirectiveFn
            addAltByEncoding: DirectiveFn
            addAltByType: DirectiveFn
            addCharset: DirectiveFn
            addDefaultCharset: DirectiveFn
            addDescription: DirectiveFn
            addEncoding: DirectiveFn
            addHandler: DirectiveFn
            addIcon: DirectiveFn
            addIconByEncoding: DirectiveFn
            addIconByType: DirectiveFn
            addInputFilter: DirectiveFn
            addLanguage: DirectiveFn
            addModuleInfo: DirectiveFn
            addOutputFilter: DirectiveFn
            addOutputFilterByType: DirectiveFn
            addType: DirectiveFn
            alias: DirectiveFn
            aliasMatch: DirectiveFn
            allow: DirectiveFn
            allowConnect: DirectiveFn
            allowEncodedSlashes: DirectiveFn
            allowMethods: DirectiveFn
            allowOverride: DirectiveFn
            allowOverrideList: DirectiveFn
            anonymous: DirectiveFn
            anonymousLogEmail: DirectiveFn
            anonymousMustGiveEmail: DirectiveFn
            anonymousNoUserId: DirectiveFn
            anonymousVerifyEmail: DirectiveFn
            asyncRequestWorkerFactor: DirectiveFn
            authBasicAuthoritative: DirectiveFn
            authBasicFake: DirectiveFn
            authBasicProvider: DirectiveFn
            authBasicUseDigestAlgorithm: DirectiveFn
            authDbduserPwquery: DirectiveFn
            authDbduserRealmQuery: DirectiveFn
            authDbmgroupFile: DirectiveFn
            authDbmtype: DirectiveFn
            authDbmuserFile: DirectiveFn
            authDigestAlgorithm: DirectiveFn
            authDigestDomain: DirectiveFn
            authDigestNonceLifetime: DirectiveFn
            authDigestProvider: DirectiveFn
            authDigestQop: DirectiveFn
            authDigestShmemSize: DirectiveFn
            authFormAuthoritative: DirectiveFn
            authFormBody: DirectiveFn
            authFormDisableNoStore: DirectiveFn
            authFormFakeBasicAuth: DirectiveFn
            authFormLocation: DirectiveFn
            authFormLoginRequiredLocation: DirectiveFn
            authFormLoginSuccessLocation: DirectiveFn
            authFormLogoutLocation: DirectiveFn
            authFormMethod: DirectiveFn
            authFormMimetype: DirectiveFn
            authFormPassword: DirectiveFn
            authFormProvider: DirectiveFn
            authFormSitePassphrase: DirectiveFn
            authFormSize: DirectiveFn
            authFormUsername: DirectiveFn
            authGroupFile: DirectiveFn
            authLdapauthorizePrefix: DirectiveFn
            authLdapbindAuthoritative: DirectiveFn
            authLdapbindDn: DirectiveFn
            authLdapbindPassword: DirectiveFn
            authLdapcharsetConfig: DirectiveFn
            authLdapcompareAsUser: DirectiveFn
            authLdapcompareDnonServer: DirectiveFn
            authLdapdereferenceAliases: DirectiveFn
            authLdapgroupAttribute: DirectiveFn
            authLdapgroupAttributeIsDn: DirectiveFn
            authLdapinitialBindAsUser: DirectiveFn
            authLdapinitialBindPattern: DirectiveFn
            authLdapmaxSubGroupDepth: DirectiveFn
            authLdapremoteUserAttribute: DirectiveFn
            authLdapremoteUserIsDn: DirectiveFn
            authLdapsearchAsUser: DirectiveFn
            authLdapsubGroupAttribute: DirectiveFn
            authLdapsubGroupClass: DirectiveFn
            authLdapurl: DirectiveFn
            authMerging: DirectiveFn
            authName: DirectiveFn
            authnCacheContext: DirectiveFn
            authnCacheEnable: DirectiveFn
            authnCacheProvideFor: DirectiveFn
            authnCacheSocache: DirectiveFn
            authnCacheTimeout: DirectiveFn
            authnProviderAlias: DirectiveFn
            authType: DirectiveFn
            authUserFile: DirectiveFn
            authzDbdloginToReferer: DirectiveFn
            authzDbdquery: DirectiveFn
            authzDbdredirectQuery: DirectiveFn
            authzDbmtype: DirectiveFn
            authzProviderAlias: DirectiveFn
            authzSendForbiddenOnFailure: DirectiveFn
            balancerGrowth: DirectiveFn
            balancerInherit: DirectiveFn
            balancerMember: DirectiveFn
            balancerPersist: DirectiveFn
            browserMatch: DirectiveFn
            browserMatchNoCase: DirectiveFn
            bufferedLogs: DirectiveFn
            bufferSize: DirectiveFn
            cacheDefaultExpire: DirectiveFn
            cacheDetailHeader: DirectiveFn
            cacheDirLength: DirectiveFn
            cacheDirLevels: DirectiveFn
            cacheDisable: DirectiveFn
            cacheEnable: DirectiveFn
            cacheFile: DirectiveFn
            cacheHeader: DirectiveFn
            cacheIgnoreCacheControl: DirectiveFn
            cacheIgnoreHeaders: DirectiveFn
            cacheIgnoreNoLastMod: DirectiveFn
            cacheIgnoreQueryString: DirectiveFn
            cacheIgnoreUrlsessionIdentifiers: DirectiveFn
            cacheKeyBaseUrl: DirectiveFn
            cacheLastModifiedFactor: DirectiveFn
            cacheLock: DirectiveFn
            cacheLockMaxAge: DirectiveFn
            cacheLockPath: DirectiveFn
            cacheMaxExpire: DirectiveFn
            cacheMaxFileSize: DirectiveFn
            cacheMinExpire: DirectiveFn
            cacheMinFileSize: DirectiveFn
            cacheNegotiatedDocs: DirectiveFn
            cacheQuickHandler: DirectiveFn
            cacheReadSize: DirectiveFn
            cacheReadTime: DirectiveFn
            cacheRoot: DirectiveFn
            cacheSocache: DirectiveFn
            cacheSocacheMaxSize: DirectiveFn
            cacheSocacheMaxTime: DirectiveFn
            cacheSocacheMinTime: DirectiveFn
            cacheSocacheReadSize: DirectiveFn
            cacheSocacheReadTime: DirectiveFn
            cacheStaleOnError: DirectiveFn
            cacheStoreExpired: DirectiveFn
            cacheStoreNoStore: DirectiveFn
            cacheStorePrivate: DirectiveFn
            cgimapExtension: DirectiveFn
            charsetDefault: DirectiveFn
            charsetOptions: DirectiveFn
            charsetSourceEnc: DirectiveFn
            checkCaseOnly: DirectiveFn
            checkSpelling: DirectiveFn
            chrootDir: DirectiveFn
            contentDigest: DirectiveFn
            cookieDomain: DirectiveFn
            cookieExpires: DirectiveFn
            cookieName: DirectiveFn
            cookieStyle: DirectiveFn
            cookieTracking: DirectiveFn
            coreDumpDirectory: DirectiveFn
            customLog: DirectiveFn
            dav: DirectiveFn
            davDepthInfinity: DirectiveFn
            davGenericLockDb: DirectiveFn
            davLockDb: DirectiveFn
            davMinTimeout: DirectiveFn
            dbdexptime: DirectiveFn
            dbdinitSql: DirectiveFn
            dbdkeep: DirectiveFn
            dbdmax: DirectiveFn
            dbdmin: DirectiveFn
            dbdparams: DirectiveFn
            dbdpersist: DirectiveFn
            dbdprepareSql: DirectiveFn
            dbdriver: DirectiveFn
            defaultIcon: DirectiveFn
            defaultLanguage: DirectiveFn
            defaultRuntimeDir: DirectiveFn
            defaultType: DirectiveFn
            define: DirectiveFn
            deflateBufferSize: DirectiveFn
            deflateCompressionLevel: DirectiveFn
            deflateFilterNote: DirectiveFn
            deflateMemLevel: DirectiveFn
            deflateWindowSize: DirectiveFn
            deny: DirectiveFn
            directory: DirectiveFn
            directoryIndex: DirectiveFn
            directoryIndexRedirect: DirectiveFn
            directoryMatch: DirectiveFn
            directorySlash: DirectiveFn
            documentRoot: DirectiveFn
            dtracePrivileges: DirectiveFn
            dumpIoinput: DirectiveFn
            dumpIooutput: DirectiveFn
            else: DirectiveFn
            elseIf: DirectiveFn
            enableExceptionHook: DirectiveFn
            enableMmap: DirectiveFn
            enableSendfile: DirectiveFn
            error: DirectiveFn
            errorDocument: DirectiveFn
            errorLog: DirectiveFn
            errorLogFormat: DirectiveFn
            example: DirectiveFn
            expiresActive: DirectiveFn
            expiresByType: DirectiveFn
            expiresDefault: DirectiveFn
            extendedStatus: DirectiveFn
            extFilterDefine: DirectiveFn
            extFilterOptions: DirectiveFn
            fallbackResource: DirectiveFn
            fileEtag: DirectiveFn
            files: DirectiveFn
            filesMatch: DirectiveFn
            filterChain: DirectiveFn
            filterDeclare: DirectiveFn
            filterProtocol: DirectiveFn
            filterProvider: DirectiveFn
            filterTrace: DirectiveFn
            forceLanguagePriority: DirectiveFn
            forceType: DirectiveFn
            forensicLog: DirectiveFn
            gprofDir: DirectiveFn
            gracefulShutdownTimeout: DirectiveFn
            group: DirectiveFn
            header: DirectiveFn
            headerName: DirectiveFn
            heartbeatAddress: DirectiveFn
            heartbeatListen: DirectiveFn
            heartbeatMaxServers: DirectiveFn
            heartbeatStorage: DirectiveFn
            hostnameLookups: DirectiveFn
            identityCheck: DirectiveFn
            identityCheckTimeout: DirectiveFn
            if: DirectiveFn
            ifDefine: DirectiveFn
            ifModule: DirectiveFn
            ifVersion: DirectiveFn
            imapBase: DirectiveFn
            imapDefault: DirectiveFn
            imapMenu: DirectiveFn
            include: DirectiveFn
            includeOptional: DirectiveFn
            indexHeadInsert: DirectiveFn
            indexIgnore: DirectiveFn
            indexIgnoreReset: DirectiveFn
            indexOptions: DirectiveFn
            indexOrderDefault: DirectiveFn
            indexStyleSheet: DirectiveFn
            inputSed: DirectiveFn
            isapiappendLogToErrors: DirectiveFn
            isapiappendLogToQuery: DirectiveFn
            isapicacheFile: DirectiveFn
            isapifakeAsync: DirectiveFn
            isapilogNotSupported: DirectiveFn
            isapireadAheadBuffer: DirectiveFn
            keepAlive: DirectiveFn
            keepAliveTimeout: DirectiveFn
            keptBodySize: DirectiveFn
            languagePriority: DirectiveFn
            ldapcacheEntries: DirectiveFn
            ldapcacheTtl: DirectiveFn
            ldapconnectionPoolTtl: DirectiveFn
            ldapconnectionTimeout: DirectiveFn
            ldaplibraryDebug: DirectiveFn
            ldapopCacheEntries: DirectiveFn
            ldapopCacheTtl: DirectiveFn
            ldapreferralHopLimit: DirectiveFn
            ldapreferrals: DirectiveFn
            ldapretries: DirectiveFn
            ldapretryDelay: DirectiveFn
            ldapsharedCacheFile: DirectiveFn
            ldapsharedCacheSize: DirectiveFn
            ldaptimeout: DirectiveFn
            ldaptrustedClientCert: DirectiveFn
            ldaptrustedGlobalCert: DirectiveFn
            ldaptrustedMode: DirectiveFn
            ldapverifyServerCert: DirectiveFn
            limit: DirectiveFn
            limitExcept: DirectiveFn
            limitInternalRecursion: DirectiveFn
            limitRequestBody: DirectiveFn
            limitRequestFields: DirectiveFn
            limitRequestFieldSize: DirectiveFn
            limitRequestLine: DirectiveFn
            limitXmlrequestBody: DirectiveFn
            listen: DirectiveFn
            listenBackLog: DirectiveFn
            loadFile: DirectiveFn
            loadModule: DirectiveFn
            location: DirectiveFn
            locationMatch: DirectiveFn
            logFormat: DirectiveFn
            logLevel: DirectiveFn
            logMessage: DirectiveFn
            luaAuthzProvider: DirectiveFn
            luaCodeCache: DirectiveFn
            luaHookAccessChecker: DirectiveFn
            luaHookAuthChecker: DirectiveFn
            luaHookCheckUserId: DirectiveFn
            luaHookFixups: DirectiveFn
            luaHookInsertFilter: DirectiveFn
            luaHookLog: DirectiveFn
            luaHookMapToStorage: DirectiveFn
            luaHookTranslateName: DirectiveFn
            luaHookTypeChecker: DirectiveFn
            luaInherit: DirectiveFn
            luaInputFilter: DirectiveFn
            luaMapHandler: DirectiveFn
            luaOutputFilter: DirectiveFn
            luaPackageCpath: DirectiveFn
            luaPackagePath: DirectiveFn
            luaQuickHandler: DirectiveFn
            luaRoot: DirectiveFn
            luaScope: DirectiveFn
            macro: DirectiveFn
            maxConnectionsPerChild: DirectiveFn
            maxKeepAliveRequests: DirectiveFn
            maxMemFree: DirectiveFn
            maxRangeOverlaps: DirectiveFn
            maxRangeReversals: DirectiveFn
            maxRanges: DirectiveFn
            maxRequestWorkers: DirectiveFn
            maxSpareServers: DirectiveFn
            maxSpareThreads: DirectiveFn
            maxThreads: DirectiveFn
            metaDir: DirectiveFn
            metaFiles: DirectiveFn
            metaSuffix: DirectiveFn
            mimeMagicFile: DirectiveFn
            minSpareServers: DirectiveFn
            minSpareThreads: DirectiveFn
            mmapFile: DirectiveFn
            modemStandard: DirectiveFn
            modMimeUsePathInfo: DirectiveFn
            multiviewsMatch: DirectiveFn
            mutex: DirectiveFn
            nameVirtualHost: DirectiveFn
            noProxy: DirectiveFn
            nwssltrustedCerts: DirectiveFn
            nwsslupgradeable: DirectiveFn
            options: DirectiveFn
            order: DirectiveFn
            outputSed: DirectiveFn
            passEnv: DirectiveFn
            pidFile: DirectiveFn
            privilegesMode: DirectiveFn
            protocol: DirectiveFn
            protocolEcho: DirectiveFn
            proxy: DirectiveFn
            proxyAddHeaders: DirectiveFn
            proxyBadHeader: DirectiveFn
            proxyBlock: DirectiveFn
            proxyDomain: DirectiveFn
            proxyErrorOverride: DirectiveFn
            proxyExpressDbmfile: DirectiveFn
            proxyExpressDbmtype: DirectiveFn
            proxyExpressEnable: DirectiveFn
            proxyFtpDirCharset: DirectiveFn
            proxyFtpEscapeWildcards: DirectiveFn
            proxyFtpListOnWildcard: DirectiveFn
            proxyHtmlbufSize: DirectiveFn
            proxyHtmlcharsetOut: DirectiveFn
            proxyHtmldocType: DirectiveFn
            proxyHtmlenable: DirectiveFn
            proxyHtmlevents: DirectiveFn
            proxyHtmlextended: DirectiveFn
            proxyHtmlfixups: DirectiveFn
            proxyHtmlinterp: DirectiveFn
            proxyHtmllinks: DirectiveFn
            proxyHtmlmeta: DirectiveFn
            proxyHtmlstripComments: DirectiveFn
            proxyHtmlurlmap: DirectiveFn
            proxyIobufferSize: DirectiveFn
            proxyMatch: DirectiveFn
            proxyMaxForwards: DirectiveFn
            proxyPass: DirectiveFn
            proxyPassInherit: DirectiveFn
            proxyPassInterpolateEnv: DirectiveFn
            proxyPassMatch: DirectiveFn
            proxyPassReverse: DirectiveFn
            proxyPassReverseCookieDomain: DirectiveFn
            proxyPassReverseCookiePath: DirectiveFn
            proxyPreserveHost: DirectiveFn
            proxyReceiveBufferSize: DirectiveFn
            proxyRemote: DirectiveFn
            proxyRemoteMatch: DirectiveFn
            proxyRequests: DirectiveFn
            proxyScgiinternalRedirect: DirectiveFn
            proxyScgisendfile: DirectiveFn
            proxySet: DirectiveFn
            proxySourceAddress: DirectiveFn
            proxyStatus: DirectiveFn
            proxyTimeout: DirectiveFn
            proxyVia: DirectiveFn
            readmeName: DirectiveFn
            receiveBufferSize: DirectiveFn
            redirect: DirectiveFn
            redirectMatch: DirectiveFn
            redirectPermanent: DirectiveFn
            redirectTemp: DirectiveFn
            reflectorHeader: DirectiveFn
            remoteIpheader: DirectiveFn
            remoteIpinternalProxy: DirectiveFn
            remoteIpinternalProxyList: DirectiveFn
            remoteIpproxiesHeader: DirectiveFn
            remoteIptrustedProxy: DirectiveFn
            remoteIptrustedProxyList: DirectiveFn
            removeCharset: DirectiveFn
            removeEncoding: DirectiveFn
            removeHandler: DirectiveFn
            removeInputFilter: DirectiveFn
            removeLanguage: DirectiveFn
            removeOutputFilter: DirectiveFn
            removeType: DirectiveFn
            requestHeader: DirectiveFn
            requestReadTimeout: DirectiveFn
            require: DirectiveFn
            requireAll: DirectiveFn
            requireAny: DirectiveFn
            requireNone: DirectiveFn
            rewriteBase: DirectiveFn
            rewriteCond: DirectiveFn
            rewriteEngine: DirectiveFn
            rewriteMap: DirectiveFn
            rewriteOptions: DirectiveFn
            rewriteRule: DirectiveFn
            rlimitCpu: DirectiveFn
            rlimitMem: DirectiveFn
            rlimitNproc: DirectiveFn
            satisfy: DirectiveFn
            scoreBoardFile: DirectiveFn
            script: DirectiveFn
            scriptAlias: DirectiveFn
            scriptAliasMatch: DirectiveFn
            scriptInterpreterSource: DirectiveFn
            scriptLog: DirectiveFn
            scriptLogBuffer: DirectiveFn
            scriptLogLength: DirectiveFn
            scriptSock: DirectiveFn
            secureListen: DirectiveFn
            seeRequestTail: DirectiveFn
            sendBufferSize: DirectiveFn
            serverAdmin: DirectiveFn
            serverAlias: DirectiveFn
            serverLimit: DirectiveFn
            serverName: DirectiveFn
            serverPath: DirectiveFn
            serverRoot: DirectiveFn
            serverSignature: DirectiveFn
            serverTokens: DirectiveFn
            session: DirectiveFn
            sessionCookieName: DirectiveFn
            sessionCookieName2: DirectiveFn
            sessionCookieRemove: DirectiveFn
            sessionCryptoCipher: DirectiveFn
            sessionCryptoDriver: DirectiveFn
            sessionCryptoPassphrase: DirectiveFn
            sessionCryptoPassphraseFile: DirectiveFn
            sessionDbdcookieName: DirectiveFn
            sessionDbdcookieName2: DirectiveFn
            sessionDbdcookieRemove: DirectiveFn
            sessionDbddeleteLabel: DirectiveFn
            sessionDbdinsertLabel: DirectiveFn
            sessionDbdperUser: DirectiveFn
            sessionDbdselectLabel: DirectiveFn
            sessionDbdupdateLabel: DirectiveFn
            sessionEnv: DirectiveFn
            sessionExclude: DirectiveFn
            sessionHeader: DirectiveFn
            sessionInclude: DirectiveFn
            sessionMaxAge: DirectiveFn
            setEnv: DirectiveFn
            setEnvIf: DirectiveFn
            setEnvIfExpr: DirectiveFn
            setEnvIfNoCase: DirectiveFn
            setHandler: DirectiveFn
            setInputFilter: DirectiveFn
            setOutputFilter: DirectiveFn
            ssiendTag: DirectiveFn
            ssierrorMsg: DirectiveFn
            ssietag: DirectiveFn
            ssilastModified: DirectiveFn
            ssilegacyExprParser: DirectiveFn
            ssistartTag: DirectiveFn
            ssitimeFormat: DirectiveFn
            ssiundefinedEcho: DirectiveFn
            sslcacertificateFile: DirectiveFn
            sslcacertificatePath: DirectiveFn
            sslcadnrequestFile: DirectiveFn
            sslcadnrequestPath: DirectiveFn
            sslcarevocationCheck: DirectiveFn
            sslcarevocationFile: DirectiveFn
            sslcarevocationPath: DirectiveFn
            sslcertificateChainFile: DirectiveFn
            sslcertificateFile: DirectiveFn
            sslcertificateKeyFile: DirectiveFn
            sslcipherSuite: DirectiveFn
            sslcompression: DirectiveFn
            sslcryptoDevice: DirectiveFn
            sslengine: DirectiveFn
            sslfips: DirectiveFn
            sslhonorCipherOrder: DirectiveFn
            sslinsecureRenegotiation: DirectiveFn
            sslocspdefaultResponder: DirectiveFn
            sslocspenable: DirectiveFn
            sslocspoverrideResponder: DirectiveFn
            sslocspresponderTimeout: DirectiveFn
            sslocspresponseMaxAge: DirectiveFn
            sslocspresponseTimeSkew: DirectiveFn
            sslopenSslconfCmd: DirectiveFn
            ssloptions: DirectiveFn
            sslpassPhraseDialog: DirectiveFn
            sslprotocol: DirectiveFn
            sslproxyCacertificateFile: DirectiveFn
            sslproxyCacertificatePath: DirectiveFn
            sslproxyCarevocationCheck: DirectiveFn
            sslproxyCarevocationFile: DirectiveFn
            sslproxyCarevocationPath: DirectiveFn
            sslproxyCheckPeerCn: DirectiveFn
            sslproxyCheckPeerExpire: DirectiveFn
            sslproxyCheckPeerName: DirectiveFn
            sslproxyCipherSuite: DirectiveFn
            sslproxyEngine: DirectiveFn
            sslproxyMachineCertificateChainFile: DirectiveFn
            sslproxyMachineCertificateFile: DirectiveFn
            sslproxyMachineCertificatePath: DirectiveFn
            sslproxyProtocol: DirectiveFn
            sslproxyVerify: DirectiveFn
            sslproxyVerifyDepth: DirectiveFn
            sslrandomSeed: DirectiveFn
            sslrenegBufferSize: DirectiveFn
            sslrequire: DirectiveFn
            sslrequireSsl: DirectiveFn
            sslsessionCache: DirectiveFn
            sslsessionCacheTimeout: DirectiveFn
            sslsessionTicketKeyFile: DirectiveFn
            sslsrpunknownUserSeed: DirectiveFn
            sslsrpverifierFile: DirectiveFn
            sslstaplingCache: DirectiveFn
            sslstaplingErrorCacheTimeout: DirectiveFn
            sslstaplingFakeTryLater: DirectiveFn
            sslstaplingForceUrl: DirectiveFn
            sslstaplingResponderTimeout: DirectiveFn
            sslstaplingResponseMaxAge: DirectiveFn
            sslstaplingResponseTimeSkew: DirectiveFn
            sslstaplingReturnResponderErrors: DirectiveFn
            sslstaplingStandardCacheTimeout: DirectiveFn
            sslstrictSnivhostCheck: DirectiveFn
            ssluserName: DirectiveFn
            ssluseStapling: DirectiveFn
            sslverifyClient: DirectiveFn
            sslverifyDepth: DirectiveFn
            startServers: DirectiveFn
            startThreads: DirectiveFn
            substitute: DirectiveFn
            suexec: DirectiveFn
            suexecUserGroup: DirectiveFn
            threadLimit: DirectiveFn
            threadsPerChild: DirectiveFn
            threadStackSize: DirectiveFn
            timeOut: DirectiveFn
            traceEnable: DirectiveFn
            transferLog: DirectiveFn
            typesConfig: DirectiveFn
            unDefine: DirectiveFn
            undefMacro: DirectiveFn
            unsetEnv: DirectiveFn
            use: DirectiveFn
            useCanonicalName: DirectiveFn
            useCanonicalPhysicalPort: DirectiveFn
            user: DirectiveFn
            userDir: DirectiveFn
            vhostCgimode: DirectiveFn
            vhostCgiprivs: DirectiveFn
            vhostGroup: DirectiveFn
            vhostPrivs: DirectiveFn
            vhostSecure: DirectiveFn
            vhostUser: DirectiveFn
            virtualDocumentRoot: DirectiveFn
            virtualDocumentRootIp: DirectiveFn
            virtualHost: DirectiveFn
            virtualScriptAlias: DirectiveFn
            virtualScriptAliasIp: DirectiveFn
            watchdogInterval: DirectiveFn
            xbitHack: DirectiveFn
            xml2EncAlias: DirectiveFn
            xml2EncDefault: DirectiveFn
            xml2StartParse: DirectiveFn
        }

    }

    var Tonto: Tonto.TontoConstructor;
    export = Tonto
}
