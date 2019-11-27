import { MenuNode } from './MenuNode';
import { MenuItemState } from '@/interfaces';
import { MenuItemNodeArray } from './MenuItemNodeArray';
import { observable, observe, ObserverChangedFunction, ObserverSubscription } from '@radic/observable';
import { Node } from '@radic/tree';
import { MenuItem } from '@menu-item';

export function mapNodeStateObservableToTarget<NODE extends MenuItemNode,
    TARGET extends any>(node: NODE, component: TARGET, map: Partial<Record<keyof NODE['_state'], keyof TARGET>>) {
    return node.observe(change => {
        let name = change.name.toString();
        if ( name in map ) {
            component[ map[ name ] ] = change.newValue;
        }
    });
}

export class MenuItemNode extends Node<MenuItemNodeArray> {
    collectionClass = MenuItemNodeArray;
    _state: MenuItemState;
    attributes: any = {};
    data: any       = {};


    constructor(public readonly item:MenuItem, public readonly _menu: MenuNode) {
        super(_menu);
        this._state = observable(_menu.getDefaultState());
        this.observe(change => this.fire(change.name.toString(), change.name, change.newValue, this.state()));
    }

    observe(key: string, listener: ObserverChangedFunction): ObserverSubscription
    observe(listener: ObserverChangedFunction): ObserverSubscription
    observe(...params: [ string, ObserverChangedFunction ] | [ ObserverChangedFunction ]): ObserverSubscription {
        return observe(this._state, change => {
            if ( change.type === 'update' ) {
                if ( params.length === 1 ) {
                    params[ 0 ](change);
                } else if ( params.length === 2 ) {
                    params[ 1 ](change);
                }
            }
        });
        // return this;
    }

    set<K extends keyof MenuItemState>(key: K, value: MenuItemState[K], ...fire: string[]): this {
        if ( this.state(key) !== value ) {
            this.state(key, value);
            if ( fire ) {
                // console.trace(`set ${key} = ${value}`)
                this.fire(fire, key, value, this.state());
            }
        }
        return this;
    }

    fire(name: string | string[], ...extraArgs): this {
        const { itemPrefix, delimiter } = this._menu.config.events;
        let names: string[]             = Array.isArray(name) ? name : [ name ];
        for ( const name of names ) {
            const eventName = `${itemPrefix}${delimiter}${name}`;
            this._menu.emit(eventName, this, eventName, ...extraArgs);
        }
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


    expand(): this {return this.set('expanded', true, 'expand');}

    collapse(): this {return this.set('expanded', false, 'collapse');}

    collapsed(): boolean {return !this.state('expanded');}

    expanded(): boolean {return this.state('expanded');}

    toggle(): this {return this.collapsed() ? this.expand() : this.collapse();}

    toggleCollapse(): this {return this.collapsed() ? this.expand() : this.collapse();}


    select(): this {return this.set('selected', true, 'select');}

    deselect(): this {return this.set('selected', false, 'deselect');}

    selected(): boolean {return this.state('selected'); }

    toggleSelect(): this {return this.selected() ? this.deselect() : this.select();}


    hover(): this {return this.set('hovered', true, 'hover');}

    unhover(): this {return this.set('hovered', false, 'unhover');}

    hovered(): boolean {return this.state('hovered'); }

    toggleHover(): this {return this.hovered() ? this.unhover() : this.hover();}

    slug(): string | null
    slug(slug: string): this
    slug(slug?: string): any {
        return slug ? this.state('slug', slug) : this.state('slug');
    }


    getState() {return { ...this._state };}

    menu(): MenuNode {return this._menu;}

}
