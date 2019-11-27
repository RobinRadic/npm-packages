

export function findParent<T =any>(parentTag: string|string[], of: HTMLElement):T {
    let tags = Array.isArray(parentTag) ? parentTag : [parentTag];
    if ( !of.parentElement ) {
        return null;
    }
    for(const tag of tags) {
        if ( of.parentElement.tagName.toLowerCase() === tag.toLowerCase() ) {
            return of.parentElement as any;
        }
    }
    return findParent(tags, of.parentElement);
}
