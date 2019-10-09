import { EventEmitter2 } from 'eventemitter2';
import { MenuItemNode } from './MenuItemNode';
import { MenuItemNodeArray } from './MenuItemNodeArray';
import { merge } from 'lodash';
import { RootNode } from '@radic/tree';
import { MenuConfig, MenuItemState } from './interfaces';

const log = require('debug')('components:menu:Menu');

export interface MenuNode extends EventEmitter2 {
    constructor: typeof MenuNode

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
        focused  : false,
        hidden   : false,
        collapsed: true,
        selected : false,
    };

    nodeClass       = MenuItemNode;
    collectionClass = MenuItemNodeArray;
    events: EventEmitter2;
    config: MenuConfig;


    constructor(config: Partial<MenuConfig> = {}) {
        super();
        this.events = new EventEmitter2({
            delimiter   : ':',
            maxListeners: Infinity,
            newListener : true,
            wildcard    : true,
        }) as any;
        [ 'emit', 'emitAsync', 'addListener', 'on', 'prependListener', 'once', 'prependOnceListener', 'many', 'prependMany', 'onAny', 'prependAny', 'offAny', 'removeListener', 'off', 'removeAllListeners', 'setMaxListeners', 'eventNames', 'listeners', 'listenersAny' ].forEach(name => {
            this[ name ] = this.events[ name ].bind(this.events);
        });
        this.configure(config);
    }

    configure(config: Partial<MenuConfig>) {
        this.config = merge({}, this.constructor.defaultConfig, config) as MenuConfig;
    }

    getDefaultState(): MenuItemState {
        return { ...this.constructor.defaultState } as any;
    }

    get(key: string) {
        let keys               = key.split('.').map(v => parseInt(v));
        let node: MenuItemNode = this as any;
        while ( keys.length > 0 ) {
            log('get', key, 'keys:', keys);
            let currentKey = keys.shift();
            log('get', key, 'keys:', keys, 'currentKey:', currentKey);
            if ( !node.getChildren().hasItem(currentKey) ) {
                console.warn('could not get item ', currentKey, 'of node', node, 'children', node.getChildren());
                return node;
            }
            node = node.getChildren().item(currentKey);
        }
        return node;
    }
}
