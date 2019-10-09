import { MenuNode } from './MenuNode';
import { MenuItemState } from './interfaces';
import { MenuItemNodeArray } from './MenuItemNodeArray';
import { observable, observe, ObserverChangedFunction } from '@radic/observable';
import { Node } from '@radic/tree';

const log = require('debug')('components:menu:MenuItem');

export class MenuItemNode extends Node<MenuItemNodeArray> {
    collectionClass = MenuItemNodeArray;
    protected _state: MenuItemState;
    attributes: any = {};
    id: string;
    type: string;
    data: any       = {};


    constructor(public readonly _menu: MenuNode) {
        super(_menu);
        this._state = observable(_menu.getDefaultState());
        this.observe(change => this.fire(change.name.toString(), change.name, change.newValue, this.state()));
    }

    observe(key: string, listener: ObserverChangedFunction): this
    observe(listener: ObserverChangedFunction): this
    observe(...params: [ string, ObserverChangedFunction ] | [ ObserverChangedFunction ]): this {
        observe(this._state, change => {
            if ( change.type === 'update' ) {
                if ( params.length === 1 ) {
                    params[ 0 ](change);
                } else if ( params.length === 2 ) {
                    params[ 1 ](change);
                }
            }
        });
        return this;
    }

    set<K extends keyof MenuItemState>(key: K, value: MenuItemState[K], fire?: string): this {
        if ( this.state(key) !== value ) {
            this.state(key, value);
        }
        if ( fire ) {
            // console.trace(`set ${key} = ${value}`)
            this.fire(fire, key, value, this.state());
        }
        return this;
    }

    fire(name: string, ...extraArgs): this {
        const { itemPrefix, delimiter } = this._menu.config.events;
        const eventName = `${itemPrefix}${delimiter}${name}`
        this._menu.emit(eventName, this,eventName, ...extraArgs);
        return this;
    }

    state<K extends keyof MenuItemState>(): MenuItemState
    state<K extends keyof MenuItemState>(key: K): MenuItemState[K]
    state<K extends keyof MenuItemState>(object: MenuItemState): undefined
    state<K extends keyof MenuItemState>(key: K, value: MenuItemState[K]): undefined
    state<K extends keyof MenuItemState>(...params): any {
        let [ key, value ] = params;
        if ( key === undefined ) {
            return { ...this._state };
        }
        if ( value === undefined ) {
            if ( typeof key === 'string' ) {
                return this._state[ key ];
            } else if ( typeof key === 'object' ) {
                Object.entries(key as MenuItemState).forEach(([ v, k ]) => this._state[ k ] = v);
            }
        } else {
            this._state[ key as K ] = value;
        }
    }

    key() {
        return this.getAncestorsAndSelf().slice(1).map(node => node.getIndex()).join('.');
    }

    focus(): this {return this.set('focused', true, 'focus');}

    blur(): this {return this.set('focused', false, 'blur');}

    focused(): boolean {return this.state('focused'); }

    toggleFocus(): this {return this.focused() ? this.blur() : this.focus();}


    show(): this {return this.set('hidden', false, 'show');}

    hide(): this {return this.set('hidden', true, 'hide');}

    hidden(): boolean {return this.state('hidden');}

    visible(): boolean {return !this.state('hidden');}

    toggleHidden(): this {return this.hidden() ? this.show() : this.hide();}


    expand(): this {return this.set('collapsed', false, 'expand');}

    collapse(): this {return this.set('collapsed', true, 'collapse');}

    collapsed(): boolean {return this.state('collapsed');}

    expanded(): boolean {return !this.state('collapsed');}

    toggle(): this {return this.collapsed() ? this.expand() : this.collapse();}


    select(): this {return this.set('selected', true, 'select');}

    deselect(): this {return this.set('selected', false, 'deselect');}

    selected(): boolean {return this.state('selected'); }

    toggleSelect(): this {return this.selected() ? this.deselect() : this.select();}

    getState() {return { ...this._state };}

    menu(): MenuNode {return this._menu;}

}
