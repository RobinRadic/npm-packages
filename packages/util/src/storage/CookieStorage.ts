import { IStorageProvider } from './interfaces';
import { BaseStorageProvider } from './BaseStorageProvider';

export class CookieStorage extends BaseStorageProvider implements IStorageProvider {
    get length() {
        return this.keys().length;
    }

    getSize(key: any): string {
        key = key || false;
        if ( key ) {
            return ((window.sessionStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        }
        else {
            var total = 0;
            for ( var x in window.sessionStorage ) {
                total += (window.sessionStorage[ x ].length * 2) / 1024 / 1024;
            }
            return total.toFixed(2);
        }
    }

    cookieRegistry: any[] = [];

    protected listenCookieChange(cookieName, callback) {
        setInterval(() => {
            if ( this.hasItem(cookieName) ) {
                if ( this.getItem(cookieName) != this.cookieRegistry[ cookieName ] ) {
                    // update registry so we dont get triggered again
                    this.cookieRegistry[ cookieName ] = this.getItem(cookieName);
                    return callback();
                }
            }
            else {
                this.cookieRegistry[ cookieName ] = this.getItem(cookieName);
            }
        }, 100);
    }


    onStoreEvent(callback: Function) {
        this.keys().forEach((name: string) => {
            this.listenCookieChange(name, callback);
        })
    }

    clear(): void {
        this.keys().forEach((name: string) => {
            this.removeItem(name);
        })
    }

    key(index: number): string {
        return this.keys()[ index ];
    }


    getItem(sKey) {
        if ( ! sKey ) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }

    setItem(sKey: any, sValue: any, vEnd?: any, sPath?: any, sDomain?: any, bSecure?: any): void {
        if ( ! sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey) ) {
            return;
        }
        var sExpires = "";
        if ( vEnd ) {
            switch ( vEnd.constructor ) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return;
    }


    removeItem(key: string, sPath?: any, sDomain?: any) {
        if ( ! this.hasItem(key) ) {
            return false;
        }
        document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    }

    hasItem(sKey) {
        if ( ! sKey ) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }

    keys() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for ( var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx ++ ) {
            aKeys[ nIdx ] = decodeURIComponent(aKeys[ nIdx ]);
        }
        return aKeys;
    }

}

