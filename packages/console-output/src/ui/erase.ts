export interface Erasers {

    screen: string
    screenLeft: string
    screenRight: string
    line: string
    lineLeft: string
    lineRight: string
}

export const erase: Erasers = {
    screen     : '\x1b[2J',
    screenLeft : '\x1b[1J',
    screenRight: '\x1b[J',
    line       : '\x1b[2K',
    lineLeft   : '\x1b[1K',
    lineRight  : '\x1b[K',
};

