import kindOf from './kindOf';

function generateRandomId(length?: number): string {
    if ( kindOf(length) === 'number' ) {
        length = 15;
    }
    var text: string     = '';
    var possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i ++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export default generateRandomId;
