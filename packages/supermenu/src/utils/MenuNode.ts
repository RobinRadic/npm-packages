import EventEmitter, { EventEmitter2, Listener } from 'eventemitter2';
import { MenuItemNode } from './MenuItemNode';
import { MenuItemNodeArray } from './MenuItemNodeArray';
import { RootNode } from '@radic/tree';
import { MenuConfig, MenuItemState } from '../interfaces';
import { bindEventEmitter } from './eventEmitter';
import { MenuItem } from '@menu-item';
import { Menu } from '@menu';

export interface MenuNode extends EventEmitter2 {
    constructor: typeof MenuNode

    on(event: string | string[], listener: Listener): this;

    on(event: 'item:focused', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:focus', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:blur', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:hidden', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:show', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:hide', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:expanded', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:expand', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:collapse', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:selected', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:select', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:deselect', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:hovered', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:hover', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this

    on(event: 'item:unhover', listener: (node?: MenuItemNode, eventName?: string, key?: string, value?: boolean, state?: MenuItemState) => any): this
}


export class MenuNode<C extends MenuItemNodeArray = MenuItemNodeArray> extends RootNode<C> {
    static defaultConfig: MenuConfig   = {
        events: {
            delimiter   : ':',
            maxListeners: Infinity,
            newListener : true,
            wildcard    : true,
            itemPrefix  : 'item',
        },
    };
    static defaultState: MenuItemState = {
        focused : false,
        hidden  : false,
        expanded: false,
        selected: false,
        hovered : false,
    };

    nodeClass       = MenuItemNode;
    collectionClass = MenuItemNodeArray;
    events: EventEmitter2;
    config: MenuConfig;


    constructor(public readonly menu:Menu, config: Partial<MenuConfig> = {}) {
        super();
        this.events = new (EventEmitter as any)({
            delimiter   : ':',
            maxListeners: Infinity,
            newListener : true,
            wildcard    : true,
        }) as any;
        bindEventEmitter(this.events, this);
        // [ 'emit', 'emitAsync', 'addListener', 'on', 'prependListener', 'once', 'prependOnceListener', 'many', 'prependMany', 'onAny', 'prependAny', 'offAny', 'removeListener', 'off', 'removeAllListeners', 'setMaxListeners', 'eventNames', 'listeners', 'listenersAny' ].forEach(name => { this[ name ] = this.events[ name ].bind(this.events); });
        this.configure(config);
    }

    createMenuItemNode(menuItem: MenuItem) {
        const node = new this.nodeClass(menuItem, this);
        node.setCollectionClass(this.collectionClass);
        return node;
    }

    configure(config: Partial<MenuConfig>) {
        this.config = {
            ...this.constructor.defaultConfig,
            ...config,
            events: {
                ...this.constructor.defaultConfig.events,
                ...config.events,
            },
        };//merge({}, this.constructor.defaultConfig, config) as MenuConfig;
    }

    getDefaultState(): MenuItemState {
        return { ...this.constructor.defaultState } as any;
    }

    findByIndex(key: string) {
        let keys               = key.split('.').map(v => parseInt(v));
        let node: MenuItemNode = this as any;
        while ( keys.length > 0 ) {
            let currentKey = keys.shift();
            if ( !node.getChildren().hasItem(currentKey) ) {
                console.warn('could not get item ', currentKey, 'of node', node, 'children', node.getChildren());
                return node;
            }
            node = node.getChildren().item(currentKey);
        }
        return node;
    }

    findBySlug(slug: string) {
        return this.getAllDescendants().findBySlug(slug);
    }
}
