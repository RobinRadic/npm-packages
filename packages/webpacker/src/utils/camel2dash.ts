
export function camel2Dash(_str: string) {
    const str = _str[ 0 ].toLowerCase() + _str.substr(1)
    return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)
}
