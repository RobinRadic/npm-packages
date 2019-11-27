///<reference path="../../../global.d.ts"/>

import { Component, ComponentInterface, Element, h, Host, Listen, Method, Prop, Watch } from '@stencil/core';
import { MENU_PREFIX, MenuNode } from '#';
import { MenuItem } from '@menu-item';
import { IMenuNode } from '@/interfaces';
import { ParentItemTunnel, MenuTunnel } from '#/tunnels';
import {createContext} from 'stencil-context'
const MenuContext = createContext({menu:null})

@Component({
    tag     : 'smu-menu',
    styleUrl: '../../../scss/supermenu.scss',
    // shadow: true,
})
export class Menu implements ComponentInterface, IMenuNode {
    @Method()
    async getInstance() {return this;}

    @Element() el: HTMLElement;

    @Prop({ mutable: true }) collapsed  = false;
    @Prop({ mutable: true }) horizontal = false;
    @Prop({ mutable: true }) inline     = false;
    @Prop({ mutable: true }) dropdown   = false;
    @Prop() collapsedTooltip: string;
    @Prop() slug: string;

    node: MenuNode;
    items: MenuItem[] = [];

    componentWillLoad() {
        this.node = new MenuNode(this, {});
        SMU.registerMenu(this);
        this.node.onAny((event, values, ...args) => {
            if ( event.toString().includes('hover') ) {
                return;
            }
            console.log(event, values, ...args);
        });
        // this.node.onAny(((event, values) => console.log(event, values)))
    }

    render() {
        return (
            <Host class={this.classes} style={this.styles}>
                <MenuTunnel.Provider value={{ menu: this }}>
                    <ParentItemTunnel.Provider value={{ parentItem: this }}>
                        <slot></slot>
                    </ParentItemTunnel.Provider>
                </MenuTunnel.Provider>
            </Host>
        );
    }

    get classes() {
        return {
            // 'hydrated':true,
            [ `${MENU_PREFIX}` ]            : true,
            [ `${MENU_PREFIX}--collapsed` ] : this.collapsed,
            [ `${MENU_PREFIX}--horizontal` ]: this.horizontal,
            [ `${MENU_PREFIX}--inline` ]    : this.inline,
            [ `${MENU_PREFIX}--dropdown` ]  : this.dropdown,
        };
    }

    get styles() {
        return {};
    }

    @Watch('collapsed')
    onCollapsedChange(value, previousValue, propName) {
        console.log('onCollapsedChange', value, '  previousValue:', previousValue, { propName });
        if ( value ) {
            this.node.getAllDescendants().expanded().collapse();
            let children = this.node.getChildren();
            this.items.filter(item => children.includes(item.node))
                .forEach(item => {
                    console.log('onCollapsedChange child item', item);
                    item.el[ 'forceUpdate' ]();
                });
        }
    }

    // @Method()
    async registerItem(item: MenuItem) {
        this.items.push(item);
        // console.log('registerItem', item);
        return this;
    }

    @Method()
    async getItems(): Promise<MenuItem[]> {
        return this.items;
    }

    @Listen('hovered')
    onHovered(event) {
        console.log('onHovered', { event });
    }

}
