import { INode } from '@radic/tree';


export interface EventEmitter2Options {
    /**
     * @default false
     * @description set this to `true` to use wildcards.
     */
    wildcard?: boolean,
    /**
     * @default '.'
     * @description the delimiter used to segment namespaces.
     */
    delimiter?: string,
    /**
     * @default true
     * @description set this to `true` if you want to emit the newListener events.
     */
    newListener?: boolean,
    /**
     * @default 10
     * @description the maximum amount of listeners that can be assigned to an event.
     */
    maxListeners?: number
    /**
     * @default false
     * @description show event name in memory leak message when more than maximum amount of listeners is assigned, default false
     */
    verboseMemoryLeak?: boolean;
}

export interface MenuConfigEvents extends EventEmitter2Options {
    itemPrefix?: string
}

export interface MenuConfig {
    events?: MenuConfigEvents
}

export interface MenuItemState {
    expanded: boolean
    hidden: boolean
    focused: boolean
    selected: boolean
    hovered: boolean
    slug?:string
}

export interface IMenuNode {
    node: INode
}

export function isMenuNode(value): value is IMenuNode {
    return value && value.node;
}
