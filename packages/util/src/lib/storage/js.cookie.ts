

export interface CookieAttributes {
        /**
         * Define when the cookie will be removed. Value can be a Number
         * which will be interpreted as days from time of creation or a
         * Date instance. If omitted, the cookie becomes a session cookie.
         */
        expires?: number | Date;

        /**
         * Define the path where the cookie is available. Defaults to '/'
         */
        path?: string;

        /**
         * Define the domain where the cookie is available. Defaults to
         * the domain of the page where the cookie was created.
         */
        domain?: string;

        /**
         * A Boolean indicating if the cookie transmission requires a
         * secure protocol (https). Defaults to false.
         */
        secure?: boolean;
    }

    export interface CookiesStatic {
        /**
         * Allows default cookie attributes to be accessed, changed, or reset
         */
        defaults: CookieAttributes;

        /**
         * Create a cookie
         */
        set(name: string, value: string | object, options?: CookieAttributes): void;

        /**
         * Read cookie
         */
        get(name: string): string | undefined;

        /**
         * Read all available cookies
         */
        get(): {[key: string]: string};

        /**
         * Returns the parsed representation of the string
         * stored in the cookie according to JSON.parse
         */
        getJSON(name: string): object;

        /**
         * Returns the parsed representation of
         * all cookies according to JSON.parse
         */
        getJSON(): {[key: string]: any};

        /**
         * Delete cookie
         */
        remove(name: string, options?: CookieAttributes): void;

        /**
         * If there is any danger of a conflict with the namespace Cookies,
         * the noConflict method will allow you to define a new namespace
         * and preserve the original one. This is especially useful when
         * running the script on third party sites e.g. as part of a widget
         * or SDK. Note: The noConflict method is not necessary when using
         * AMD or CommonJS, thus it is not exposed in those environments.
         */
        noConflict(): CookiesStatic;

        /**
         * Create a new instance of the api that overrides the default
         * decoding implementation. All methods that rely in a proper
         * decoding to work, such as Cookies.remove() and Cookies.get(),
         * will run the converter first for each cookie. The returned
         * string will be used as the cookie value.
         */
        withConverter(converter: CookieConverter | { write: CookieConverter; read: CookieConverter; }): CookiesStatic;
    }

    export type CookieConverter = (value: string, name: string) => string;

let cookie:CookiesStatic = (() => {
    function extend (...args:any[]) {
        let i = 0;
        const result = {};
        for (; i < args.length; i++) {
            const attributes = args[ i ];
            for ( const key in attributes) {
                if(attributes.hasOwnProperty(key)) {
                    result[ key ] = attributes[ key ];
                }
            }
        }
        return result;
    }

    function init (converter) {
        let api:any;
        api = function(key, value, attributes) {
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    attributes.expires = new Date(new Date() as any * 1 + attributes.expires * 864e+5);
                }

                // We're using "expires" because "max-age" is not supported by IE
                attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

                try {
                    const result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                value = converter.write ?
                        converter.write(value, key) :
                        encodeURIComponent(String(value))
                            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

                key = encodeURIComponent(String(key))
                    .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                    .replace(/[\(\)]/g, window['escape']);

                let stringifiedAttributes = '';
                for ( let attributeName in attributes) {
                    if (!attributes[attributeName]) {
                        continue;
                    }
                    stringifiedAttributes += '; ' + attributeName;
                    if (attributes[attributeName] === true) {
                        continue;
                    }

                    // Considers RFC 6265 section 5.2:
                    // ...
                    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                    //     character:
                    // Consume the characters of the unparsed-attributes up to,
                    // not including, the first %x3B (";") character.
                    // ...
                    stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
                }

                return (document.cookie = key + '=' + value + stringifiedAttributes);
            }

            // Read

            const jar = {};
            const decode = function (s) {
                return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
            };
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            const cookies = document.cookie ? document.cookie.split('; ') : [];
            let i         = 0;

            for (; i < cookies.length; i++) {
                const parts = cookies[ i ].split('=');
                let cookie  = parts.slice(1).join('=');

                if (!this.json && cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    const name = decode(parts[ 0 ]);
                    cookie     = (converter.read || converter)(cookie, name) ||
                        decode(cookie);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    jar[name] = cookie;

                    if (key === name) {
                        break;
                    }
                } catch (e) {}
            }

            return key ? jar[key] : jar;
        }

        api.set = api;
        api.get = function (key) {
            return api.call(api, key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, arguments);
        };
        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.defaults = {};

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}) as any;
export default cookie