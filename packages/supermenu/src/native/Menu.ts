import { MenuNode } from '../MenuNode';
import { MenuItemNode } from '../MenuItemNode';
import { wrapClassList, WrappedClassList } from './utils';
import { MenuItemNodeArray } from '../MenuItemNodeArray';
import { EventEmitter2 } from 'eventemitter2';
import Popper, {} from 'popper.js';

const log = require('debug')('supermenu:native');

export interface MenuOptions {
    prefix?: string
    disableIcons?: boolean
    on?: { [ event: string ]: any }
}

export interface Menu extends EventEmitter2 {}

export class Menu {
    public readonly node: MenuNode;
    protected classes: WrappedClassList;
    public options: MenuOptions;
    public items: MenuItem[] = [];

    constructor(public readonly el: HTMLElement, options: MenuOptions = {}) {
        this.classes   = wrapClassList(el.classList);
        el[ '__menu' ] = this;
        this.options   = {
            prefix: 'sm',
            ...options,
        };
        this.node      = new MenuNode();
        [ 'emit', 'emitAsync', 'addListener', 'on', 'prependListener', 'once', 'prependOnceListener', 'many', 'prependMany', 'onAny', 'prependAny', 'offAny', 'removeListener', 'off', 'removeAllListeners', 'setMaxListeners', 'eventNames', 'listeners', 'listenersAny' ].forEach(name => {
            this[ name ] = this.node.events[ name ].bind(this.node.events);
        });
        Array.from(el.children).filter(el => el.classList.contains(`${this.options.prefix}-item`)).forEach(itemEl => {
            new MenuItem(itemEl as any, this, this);
        });
        this.bind();
    }

    bind() {

        // opening a submenu closes neighboring(on the same level) submenus
        this.node.on('item:expand', (item: MenuItemNode) => {
            log('on item:expand', { item });
            item.getNeighbors().expanded().collapse();
        });

        // closing a submenu also closes all child submenus
        this.node.on('item:collapse', (item: MenuItemNode) => {
            item.getAllDescendants().expanded().collapse();
        });

        for ( const eventName in (this!.options!.on || {}) ) {
            this.node.on(eventName, this.options.on[ eventName ]);
        }
    }

    registerItem(item: MenuItem) {
        this.items.push(item);
    }

    collapsed(): boolean
    collapsed(value: boolean)
    collapsed(value?: boolean): any {
        return this.handleModifierCall('collapsed', value);
    }

    horizontal(): boolean
    horizontal(value: boolean)
    horizontal(value?: boolean): any {
        return this.handleModifierCall('horizontal', value);
    }

    compact(): boolean
    compact(value: boolean)
    compact(value?: boolean): any {
        return this.handleModifierCall('compact', value);
    }

    dropdown(): boolean
    dropdown(value: boolean)
    dropdown(value?: boolean): any {
        return this.handleModifierCall('dropdown', value);
    }


    inline(): boolean
    inline(value: boolean)
    inline(value?: boolean): any {
        return this.handleModifierCall('inline', value);
    }

    protected handleModifierCall(name: string, value?: boolean) {
        let cls = `${this.options.prefix}--${name}`;
        if ( value !== undefined ) {
            this.classes.set(cls, value);
        }
        return this.classes.contains(cls);
    }

}

export class MenuItem {
    public readonly node: MenuItemNode;
    protected classes: WrappedClassList;
    protected els: {
        content?: HTMLElement
        iconWrapper?: HTMLSpanElement
        icon?: HTMLElement
        title?: HTMLElement
        arrowWrapper?: HTMLSpanElement
        arrow?: HTMLElement
        submenu?: HTMLElement
        submenuItems?: HTMLElement[]
    } = {};

    constructor(public readonly el: HTMLElement, public readonly menu: Menu, protected parent: Menu | MenuItem) {
        el[ '__menu_item' ] = this;
        this.classes        = wrapClassList(el.classList);
        this.node           = menu.node.createNode();
        parent.node.addChild(this.node);
        menu.registerItem(this);

        let selector = `:scope > .${this.menu.options.prefix}-item__content`;
        let content  = el.querySelector<HTMLElement>(selector);
        selector     = `${selector} > .${this.menu.options.prefix}-item`;
        this.els     = {
            content,
            iconWrapper : el.querySelector(`${selector}__icon`),
            icon        : el.querySelector(`${selector}__icon > i`),
            title       : el.querySelector(`${selector}__title`),
            arrowWrapper: el.querySelector(`${selector}__arrow`),
            arrow       : el.querySelector(`${selector}__arrow > i`),
            submenu     : el.querySelector(`:scope > .${this.menu.options.prefix}-item__submenu`),
            submenuItems: Array.from(el.querySelectorAll(`:scope > .${this.menu.options.prefix}-item__submenu > .${this.menu.options.prefix}-item`)),
        };

        this.els.submenuItems.forEach(itemEl => new MenuItem(itemEl as any, this.menu, this));


        this.applyFromState();

        this.node.observe(change => {
            this.applyFromState();
        });

        !this.el.hasAttribute('title') && this.el.setAttribute('title', this.els.title.textContent);
        !this.els.content.hasAttribute('title') && this.els.content.setAttribute('title', this.els.title.textContent);

        if ( this.menu.dropdown() && this.hasChildren() ) {
            let e = this.el.getBoundingClientRect();
            let w = { h: window.innerHeight, w: window.innerWidth };
            let b = {
                bottom: 269,
                height: 32,
                left  : 424.5,
                right : 474.5,
                top   : 237,
                width : 50,
                x     : 424.5,
                y     : 237,
            };

            // new Popper(this.el, this.els.submenu, {
            //
            // });
        }

        this.bind();
    }

    getSubmenuHeight() {
        if ( this.node.expanded() ) {
            return this.el.offsetHeight;
        }
        this.node.expand();
        let height = this.el.offsetHeight;
        this.node.collapse();
        return height;
    }

    bind() {
        this.el.addEventListener('click', this.handleClick);
        this.els.content.addEventListener('mouseover', this.handleMouseOver);
        this.els.content.addEventListener('mouseleave', this.handleMouseLeave);
    }

    unbind() {
        this.el.removeEventListener('click', this.handleClick);
        this.els.content.removeEventListener('mouseover', this.handleMouseOver);
        this.els.content.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    hasChildren() {return this.node.hasChildren();}

    handleClick = (event?: MouseEvent) => {
        event && event.stopPropagation();
        this.node.fire('click', event);

        if ( this.hasChildren() ) {
            this.toggle();
        } else {
            this.toggleSelect();
        }
    };

    handleMouseOver  = (event?: MouseEvent) => {
        this.classes.ensure('is-hovered');
        this.node.fire('hover:enter', event);
    };
    handleMouseLeave = (event?: MouseEvent) => {
        this.classes.ensureNot('is-hovered');
        this.node.fire('hover:leave', event);
    };

    applyFromState() {
        let s = this.node.getState();
        this.classes.set({
            'is-selected' : s.selected,
            'is-open'     : !s.collapsed && this.hasChildren(),
            'is-focused'  : s.focused,
            'is-hidden'   : s.hidden,
            'has-children': this.hasChildren(),
        });
    }


    select() { this.node.select();}

    deselect() { this.node.deselect();}

    focus() { this.node.focus();}

    blur() {this.node.blur(); }

    expand() {this.node.expand(); }

    collapse() {this.node.collapse(); }

    toggle() { this.node.toggle(); }

    toggleSelect() { this.node.toggleSelect(); }

    toggleFocus() { this.node.toggleFocus(); }

    toggleHidden() { this.node.toggleHidden(); }

    parents(includeSelf = false): MenuItemNodeArray {return includeSelf ? this.node.getAncestorsAndSelf() : this.node.getAncestors(); }

    get isRoot() {return this.node.isRoot(); }

    get depth() { return this.node.getDepth(); }

    get key() { return this.node.key(); }


    // watchCollapsed(collapsed) {
    //     if ( collapsed ) {
    //         this.node.deselect();
    //         if ( this.isSlide ) {
    //         } else if ( this.isDropdown ) {
    //             this.destroyPopper();
    //         }
    //         this.emit('collapse', this);
    //     } else {
    //         this.node.select();
    //         if ( this.isSlide ) {
    //         } else if ( this.isDropdown ) {
    //             this.createPopper();
    //         }
    //         this.emit('open', this);
    //     }
    // }

}
