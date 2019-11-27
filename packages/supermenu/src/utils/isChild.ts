export function isChild(element: HTMLElement, parentElement: HTMLElement) {
    if ( !element.parentElement ) {
        return false;
    }
    if ( element.parentElement === parentElement ) {
        return true;
    }
    return isChild(element.parentElement, parentElement);
}
