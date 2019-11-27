import { Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { ClickOutside, findParent, mapNodeStateObservableToTarget, MENU_PREFIX, SMU } from '#';
import { Menu } from '@menu';
import { MenuItemNode } from '#/MenuItemNode';
import { IMenuNode, isMenuNode } from '@/interfaces';
import { MenuSubmenu } from '@menu-submenu';
import { MenuTunnel, ParentItemTunnel } from '#/tunnels';

@Component({
    tag: 'smu-menu-item',
})
export class MenuItem implements ComponentInterface, IMenuNode {

    @Method()
    async getInstance() {return this;}

    @Element() el: HTMLElement;
    @Prop() menu: Menu;
    @Prop() parentItem: Menu | MenuItem;

    @Prop() tag: string          = 'a';
    @Prop() icon: string;
    @Prop({ mutable: true }) index: string;
    @Prop({ mutable: true }) slug: string;
    @State() isHidden: boolean   = false;
    @State() isHovered: boolean  = false;
    @State() isExpanded: boolean = false;
    @State() isSelected: boolean = false;
    @State() isFocused: boolean  = false;

    @Event({ eventName: 'smuMenuItemHovered' }) hovered: EventEmitter;
    @Event({ eventName: 'smuMenuItemSelected' }) selected: EventEmitter;
    @Event({ eventName: 'smuMenuItemFocused' }) focused: EventEmitter;
    @Event({ eventName: 'smuMenuItemClicked' }) clicked: EventEmitter;
    @Event({ eventName: 'smuMenuItemExpanded' }) expanded: EventEmitter;
    @Event({ eventName: 'smuMenuItemCollapsed' }) collapsed: EventEmitter;
    @Event({ eventName: 'smuMenuItemToggled' }) toggled: EventEmitter;

    node: MenuItemNode;
    submenu?: MenuSubmenu;
    parentSubmenu?: Menu | MenuItem;
    isSubmenuItem: boolean = false;

    els = {};
    hasTooltip = false;

    refs: {
        content?: HTMLElement
        icon?: HTMLSpanElement
        title?: HTMLSpanElement
        arrow?: HTMLSpanElement
    } = {};

    componentWillLoad() {
        this.node       = this.menu.node.createMenuItemNode(this);
        this.parentItem.node.addChild(this.node);
        this.menu.registerItem(this);

        mapNodeStateObservableToTarget(this.node, this, {
            hidden  : 'isHidden',
            focused : 'isFocused',
            expanded: 'isExpanded',
            hovered : 'isHovered',
            selected: 'isSelected',
        });

        // slug
        if ( this.slug ) {
            this.node.slug(this.slug);
        }
        // tooltip
        if ( this.menu.collapsedTooltip && this.el.hasAttribute('title') ) {
            let title = this.el.getAttribute('title');
            this.el.setAttribute('data-title', title);
            this.el.removeAttribute('title');
        }
        this.hasTooltip    = this.menu?.collapsedTooltip !== null && this.menu.collapsed === true;
        this.isSubmenuItem = this.el.parentElement.tagName.toLowerCase() === 'smu-menu-submenu';
    }

    componentDidUpdate() {
        this.hasTooltip = this.menu.collapsedTooltip !== undefined;
    }

    componentDidUnload() {
        this.parentItem.node.removeChild(this.node);
    }

    @State() get hasSubmenu() { return !!this.submenuEl; }

    get submenuEl() {return this.el.querySelector('[slot="submenu"]');}

    async setup() {
    }


    render() {
        const { tag: Tag }                         = this;
        let attr: Partial<HTMLAnchorElement> | any = {};

        if ( Tag === 'a' ) {
            attr.href = attr.href || 'javascript:void(0)';
        }

        console.log('render', this.refs?.title?.textContent, ' hasTooltip:', this.hasTooltip, this.node);
        // if ( this.menu && this.menu.collapsed && this.refs.title ) {
        //     attr.title = this.refs.title.textContent;
        // }

        return (
            <Host class={this.classes} style={this.styles}>
                <Tag class={this.classNames.content} ref={ref => this.refs.content = ref} {...attr}>
                    {
                        this.hasTooltip && this.node.getDepth() === 1 ?
                        <div class={this.classNames.tooltip}>
                            {this.refs?.title?.textContent}
                        </div> :
                        null
                    }
                    <span class={this.classNames.icon} ref={ref => this.refs.icon = ref}>
                        <slot name="icon">
                            {this.icon ? SMU.renderIcon(this.icon) : null}
                        </slot>
                    </span>
                    <span class={this.classNames.title} ref={ref => this.refs.title = ref}>
                        <slot/>
                    </span>
                    <span class={this.classNames.arrow} ref={ref => this.refs.arrow = ref}>
                        <slot name="arrow">
                            <i/>
                        </slot>
                    </span>
                </Tag>
                    <slot name="submenu"/>
            </Host>
        );
    }

    @Listen('click', {})
    handleClick(event: MouseEvent) {
        console.log('MenuItem.handleClick', { event, me: this });
        event.stopPropagation();
        if ( this.hasSubmenu ) {
            event.preventDefault();
            this.node.toggle();
        }
    }

    @ClickOutside()
    handleClickOutside(event: MouseEvent) {
        if ( this.hasSubmenu && this.node.expanded() && this.menu.dropdown ) {
            this.node.collapse();
        }
    }

    @Listen('mouseover', { capture: true })
    handleMouseOver(event: MouseEvent) { !this.node.hovered() && this.node.hover(); }

    @Listen('mouseleave', { capture: true })
    handleMouseLeave(event: MouseEvent) {this.node.hovered() && this.node.unhover(); }

    get classes() {
        return {
            // 'hydrated':true,
            [ `${MENU_PREFIX}-item` ]: true,
            'is-hidden'              : this.isHidden,
            'is-hovered'             : this.isHovered,
            'is-open'                : this.isExpanded,
            'is-selected'            : this.isSelected,
            'is-focused'             : this.isFocused,
            'has-children'           : this.hasSubmenu,
        };
    }

    get classNames() {
        return {
            content: {
                // 'hydrated':true,
                [ `${MENU_PREFIX}-item__content` ]: true,
            },
            tooltip: {
                [ `${MENU_PREFIX}-item__tooltip` ]        : true,
                [ `${MENU_PREFIX}-item__tooltip--top` ]   : this.menu?.collapsedTooltip === 'top',
                [ `${MENU_PREFIX}-item__tooltip--right` ] : this.menu?.collapsedTooltip === 'right',
                [ `${MENU_PREFIX}-item__tooltip--bottom` ]: this.menu?.collapsedTooltip === 'bottom',
                [ `${MENU_PREFIX}-item__tooltip--left` ]  : this.menu?.collapsedTooltip === 'left',
            },
            icon   : {
                [ `${MENU_PREFIX}-item__icon` ]: true,
            },
            title  : {
                [ `${MENU_PREFIX}-item__title` ]: true,
            },
            arrow  : {
                [ `${MENU_PREFIX}-item__arrow` ]: true,
            },
        };
    }

    get styles() {
        return {};
    }

}

MenuTunnel.injectProps(MenuItem, [ 'menu' ]);
ParentItemTunnel.injectProps(MenuItem, [ 'parentItem' ]);
// createEventData(data: any = {}) {return { ...data, menuItem: this, menuItemEl: this.el, menu: this.menu }; }
//
// @Method()
// async openSubmenu() {return this.setOpen(true);}
//
// @Method()
// async closeSubmenu() { return this.setOpen(false); }
//
// @Method()
// async toggleSubmenu() { this.isOpen ? this.closeSubmenu() : this.openSubmenu(); }
//
// @Method()
// async setHidden(isHidden: boolean) {this.isHidden = isHidden;}
//
// @Method()
// async setHovered(isHovered: boolean) {
//     this.isHovered = isHovered;
//     this.hovered.emit(this.createEventData({ isHovered }));
// }
//
// @Method()
// async setOpen(isOpen: boolean) {
//     this.isOpen = isOpen;
//     this.toggled.emit(this.createEventData({ isOpen }));
// }
//
// @Method()
// async setSelected(isSelected: boolean) {
//     this.isSelected = isSelected;
//     this.selected.emit(this.createEventData({ isSelected }));
// }
//
// @Method()
// async setFocused(isFocused: boolean) {
//     this.isFocused = isFocused;
//     this.selected.emit(this.createEventData({ isFocused }));
// }
