import { MenuNode } from '../MenuNode';
import { MenuItemNode } from '../MenuItemNode';
import { wrapClassList, WrappedClassList } from './utils';

export class Menu {
    public readonly node: MenuNode;
    public options: any;
    public items: MenuItem[] = [];

    constructor(public readonly el: HTMLElement, options: any = {}) {
        el['__menu'] = this
        this.options = {
            prefix: 'sm-menu',
            ...options,
        };
        this.node    = new MenuNode();
        Array.from(el.children).filter(el => el.classList.contains(`${this.options.prefix}-item`)).forEach(itemEl => {
            console.log(itemEl);
            new MenuItem(itemEl as any, this, this);
        });
    }

    registerItem(item: MenuItem) {
        this.items.push(item);
    }


}
export class MenuItem {
    public readonly node: MenuItemNode;
    protected classes: WrappedClassList;

    constructor(public readonly el: HTMLElement, public readonly menu: Menu, protected parent: Menu | MenuItem) {
        el['__menu_item'] = this
        this.classes = wrapClassList(el.classList);
        this.node    = menu.node.createNode();
        parent.node.addChild(this.node);
        menu.registerItem(this);

        let subMenuItems = el.querySelectorAll(`:scope > .${this.menu.options.prefix}-item__submenu > .${this.menu.options.prefix}-item`);
        subMenuItems.forEach(itemEl => new MenuItem(itemEl as any, this.menu, this));

        this.applyFromState();

        this.node.observe(change => {
            this.applyFromState();
        });

        this.el.addEventListener('click', this.handleClick);
    }

    handleClick = (event?:MouseEvent) => {
        event &&  event.stopPropagation();

        if(this.node.hasChildren()) {
            this.node.toggle();
        } else {
            this.node.toggleSelect()
        }
    }

    applyFromState() {
        let s = this.node.getState();
        this.classes.set({
            'is-selected' : s.selected,
            'is-open'     : !s.collapsed && this.node.hasChildren(),
            'is-focused'  : s.focused,
            'is-hidden'   : s.hidden,
            'has-children': this.node.hasChildren(),
        });
    }
}
