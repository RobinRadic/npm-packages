import { EventEmitter2 } from 'eventemitter2';
import { MenuItem } from './MenuItem';
import { MenuItems } from './MenuItems';
import { merge } from 'lodash';
import { RootNode } from '@radic/tree';
import { MenuConfig, MenuItemState } from './interfaces';

const log = require('debug')('components:menu:Menu');

export interface Menu extends EventEmitter2 {
    constructor: typeof Menu

}

export type MenuEventTypes = { open: 'sf', close: any }

export class Menu<C extends MenuItems = MenuItems> extends RootNode<C> {
    static defaultConfig: MenuConfig   = {
        open  : {
            closeSiblings: true,
        },
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

    nodeClass       = MenuItem;
    collectionClass = MenuItems;
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
        this.on('item:expand', (item: MenuItem) => {
            log('on item:expand', { closeSiblings: this.config.open.closeSiblings, item });
            if ( this.config.open.closeSiblings ) {
                item.getNeighbors().expanded().collapse();
            }
        });
    }

    configure(config: Partial<MenuConfig>) {
        this.config = merge({}, this.constructor.defaultConfig, config) as MenuConfig;
    }

    getDefaultState(): MenuItemState {
        return { ...this.constructor.defaultState } as any;
    }
}
