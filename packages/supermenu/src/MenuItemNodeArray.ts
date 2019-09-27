import { MenuNode } from './MenuNode';
import { MenuItemNode } from './MenuItemNode';
import { NodeArray } from '@radic/tree';

const log = require('debug')('components:menu:MenuItems');


export class MenuItemNodeArray extends NodeArray<MenuItemNode> {
    _menu: MenuNode
    menu():MenuNode{return this._menu}

    focused() {return this.filter(item => item.focused()) }

    focus() {return this.each(item => item.focus()) }

    blur() {return this.each(item => item.blur()) }


    selected() {return this.filter(item => item.selected()) }

    select() {return this.each(item => item.select()) }

    deselect() {return this.each(item => item.deselect()) }


    expanded() {return this.filter(item => item.expanded()) }

    collapsed() {return this.filter(item => item.collapsed()) }

    expand() {return this.each(item => item.expand()) }

    collapse() {return this.each(item => item.collapse()) }

    toggle() {return this.each(item => item.toggle()) }



    show() {return this.filter(item => item.show()) }

    hide() {return this.each(item => item.hide()) }

    hidden() {return this.each(item => item.hidden()) }

    visible() {return this.each(item => item.visible()) }


    children(parent: MenuItemNode) { return parent.getChildren()}

    nodes() { return new MenuItemNodeArray(...this) }
}
