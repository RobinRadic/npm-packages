import { AuthorizationCode } from 'simple-oauth2';

export const VERSION = '1.0.0';

const authCode = new AuthorizationCode({
    client: {
        id    : '5a8d4ca6eb9f7a2c9d6ccf6d',
        secret: 'e3ace394af9f615857ceaa61b053f966ddcfb12a',
    },
    auth  : {
        tokenHost: 'http://10.0.0.61',
    },
});

let authUrl = authCode.authorizeURL({
    redirect_uri: 'http://localhost/oauth2/callback',
    scope       : [ 'homey' ],

});

console.log(authUrl);

/*
Client ID	5a8d4ca6eb9f7a2c9d6ccf6d
Client Secret	e3ace394af9f615857ceaa61b053f966ddcfb12a
Callback URL	http://localhost, http://localhost/oauth2/callback
Scopes	homey
 */
