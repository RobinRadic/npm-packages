import { Component, ComponentInterface, Element, h, Host, Method, Prop, State } from '@stencil/core';
import { MENU_PREFIX } from '#';
import { Menu } from '@menu';
import { MenuItem } from '@menu-item';
import { MenuTunnel, ParentItemTunnel } from '#/tunnels';

@Component({
    tag: 'smu-menu-submenu',
})
export class MenuSubmenu implements ComponentInterface {

    @Method()
    async getInstance() {return this;}

    @Element() el: HTMLElement;
    @Prop() menu: Menu;
    // @Prop() parentItem: MenuItem;
    @Prop() dropdown: boolean    = false;
    @State() hasNoIcons: boolean = false;

    @State() get isDropdown() {
        if ( this.dropdown ) {
            return true;
        }
        if ( this.menu?.dropdown ) {
            return true;
        }
        return false;
    }

    items: MenuItem[];

    componentWillLoad() {
        const itemsEls: any[] = Array.from(this.el.children);
        this.items            = itemsEls.map(el => el.getInstance());
        this.hasNoIcons       = this.items.filter(item => item.icon !== undefined).length === 0;
        // debugger
        // this.parentItem.submenu = this;
        console.log('submenu', {me:this, items:this.items});
    }

    hasSetup = false;

    async setup() {
    }

    render() {
        return (
            <Host class={this.classes} style={this.styles}>
                <slot></slot>
            </Host>
        );
    }

    get classes() {
        return {
            // 'hydrated':true,
            [ `${MENU_PREFIX}-item__submenu` ]: true,
            [ `has-no-icons` ]                : this.hasNoIcons,
        };
    }

    get styles() {
        return {};
    }

}

MenuTunnel.injectProps(MenuSubmenu, [ 'menu' ]);
// ParentItemTunnel.injectProps(MenuSubmenu, [ 'parentItem' ]);
