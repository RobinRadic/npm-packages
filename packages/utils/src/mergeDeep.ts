import { Dictionary } from "./interfaces"

function isObject (obj: any): obj is object {
    return obj !== null && typeof obj === 'object'
}

function mergeDeep (
    source: Dictionary<any> = {},
    target: Dictionary<any> = {}
) {
    for (const key in target) {
        const sourceProperty = source[key]
        const targetProperty = target[key]

        // Only continue deep merging if
        // both properties are objects
        if (
            isObject(sourceProperty) &&
            isObject(targetProperty)
        ) {
            source[key] = mergeDeep(sourceProperty, targetProperty)

            continue
        }

        source[key] = targetProperty
    }

    return source
}

export default mergeDeep
