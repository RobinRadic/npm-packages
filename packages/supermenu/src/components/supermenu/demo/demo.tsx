import { Component, ComponentInterface, h, Host, State } from '@stencil/core';
import { Menu } from '@menu';
import { SMU } from '#/SMU';
import { MenuNode } from '#';


@Component({
    tag     : 'smu-demo',
    styleUrl: '../../../scss/demo.scss',
})
export class Demo implements ComponentInterface {
    renderMenu() {
        return [
            <smu-menu-item icon="dashboard">Dashboard</smu-menu-item>,
            <smu-menu-item icon="users">
                <slot>Users</slot>
                <smu-menu-submenu slot="submenu">
                    <smu-menu-item>Item 2.1</smu-menu-item>
                    <smu-menu-item>Item 2.2</smu-menu-item>
                    <smu-menu-item>Item 2.3</smu-menu-item>
                </smu-menu-submenu>
            </smu-menu-item>,
            <smu-menu-item icon="cogs">
                <slot>Settings</slot>
                <smu-menu-submenu slot="submenu">
                    <smu-menu-item icon="windows">Item 2.1</smu-menu-item>
                    <smu-menu-item icon="wifi">
                        <slot>Item 2.2</slot>
                        <smu-menu-submenu slot="submenu">
                            <smu-menu-item icon="usb">Item 2.2.1</smu-menu-item>
                            <smu-menu-item>Item 2.2.2</smu-menu-item>
                        </smu-menu-submenu>
                    </smu-menu-item>
                    <smu-menu-item icon="upload">Item 2.3</smu-menu-item>
                    <smu-menu-item>Item 2.3</smu-menu-item>
                    <smu-menu-item icon="unlock-alt">Item 2.3</smu-menu-item>
                </smu-menu-submenu>
            </smu-menu-item>,
            <smu-menu-item>Options</smu-menu-item>,
            <smu-menu-item icon="upload">Mail</smu-menu-item>,
        ];
    }

    @State() sidebarCollapsed = false;
    @State() menuPosition     = 'sidebar';

    componentWillLoad(){
        SMU.on('registerMenu',(menu:Menu) => {
            this.setupDefaultMenuBehaviour(menu)
        })
    }

    setupDefaultMenuBehaviour(menu:Menu){
        const {node} = menu;
        node.on('item:expand',(item) => {
            console.log('demo','item:expand',item)
            if(item.isRoot(true)){
                node.getChildren().without([item]).collapse()
            }
        })
        node.on('item:collapse',(item) => {
            console.log('demo','item:collapse',item)
            item.getAllDescendants().collapse();
        });
    }


    render() {
        return (
            <Host class="layout">
                <div class="layout__header">
                    <a class="layout__header-item" href="javascript:void(0)" onClick={e => this.sidebarCollapsed = !this.sidebarCollapsed}>
                        <i class="fa fa-bars"/>
                    </a>
                    <div class="layout__header-item layout__header-item--spacer"/>
                    {this.menuPosition === 'header'
                     ?
                     <div class="layout__header-item">
                         <smu-menu
                             slug="header"
                             horizontal={true}
                             dropdown={true}
                         >{this.renderMenu()}</smu-menu>
                     </div>
                     : null}
                </div>

                <div class="layout__main">
                    <div class={{
                        'layout__sidebar': true,
                        'is-collapsed'   : this.sidebarCollapsed,
                    }}>
                        {this.menuPosition === 'sidebar' ?
                         <smu-menu
                             slug="sidebar"
                             inline={true}
                             collapsed={this.sidebarCollapsed}
                             dropdown={this.sidebarCollapsed}
                             collapsedTooltip="right"
                             style={{ background: '#333333' }}
                         >{this.renderMenu()}</smu-menu> : null}
                    </div>
                    <div class="layout__content">
                        <div>
                            <span>Menu Position:</span>
                            <button class="btn btn-primary" onClick={e => this.menuPosition = 'header'}>Header</button>
                            <button class="btn btn-primary" onClick={e => this.menuPosition = 'sidebar'}>Sidebar</button>
                            <button class="btn btn-primary" onClick={e => this.menuPosition = 'footer'}>Footer</button>
                        </div>
                        {/*
                        <div class="container-fluid">
                            <div class="row m-3 demo-sm-section">
                                <div class="col-12 m-1 demo-sm-content">
                                    <h3>horizontal + dropdown</h3>
                                    <smu-menu
                                        slug="horizontal_dropdown"
                                        horizontal={true}
                                        dropdown={true}
                                        style={{ height: '50px' }}
                                    >{this.renderMenu()}</smu-menu>
                                </div>
                            </div>


                            <div class="row m-3 demo-sm-section">
                                <div class="col-3 m-1 demo-sm-content">
                                    <h3>inline</h3>
                                    <smu-menu
                                        slug="inline"
                                        inline={true}
                                    >{this.renderMenu()}</smu-menu>
                                </div>
                                <div class="col-1 m-1 demo-sm-content">
                                    <h3>left</h3>
                                    <smu-menu
                                        slug="collapsed_left"
                                        collapsed={true}
                                        dropdown={true}
                                        collapsed-tooltip="left"
                                        style={{ width: '50px', background: '#333333' }}
                                    >{this.renderMenu()}</smu-menu>
                                </div>
                                <div class="col-1 m-1 demo-sm-content">
                                    <h3>right</h3>
                                    <smu-menu
                                        slug="collapsed_right"
                                        collapsed={true}
                                        dropdown={true}
                                        collapsed-tooltip="right"
                                        style={{ width: '50px', background: '#333333' }}
                                    >{this.renderMenu()}</smu-menu>
                                </div>
                                <div class="col-1 m-1 demo-sm-content">
                                    <h3>top</h3>
                                    <smu-menu
                                        slug="collapsed_top"
                                        collapsed={true}
                                        dropdown={true}
                                        collapsed-tooltip="top"
                                        style={{ width: '50px', background: '#333333' }}
                                    >{this.renderMenu()}</smu-menu>
                                </div>
                                <div class="col-1 m-1 demo-sm-content">
                                    <h3>bottom</h3>
                                    <smu-menu
                                        slug="collapsed_bottom"
                                        collapsed={true}
                                        dropdown={true}
                                        collapsed-tooltip="bottom"
                                        style={{ width: '50px', background: '#333333' }}
                                    >{this.renderMenu()}</smu-menu>
                                </div>
                            </div>
                        </div>
                        */}
                    </div>
                </div>
                <div class="layout__footer">

                    {this.menuPosition === 'footer'
                     ?
                     <div class="layout__footer-item">
                         <smu-menu
                             slug="footer"
                             horizontal={true}
                             dropdown={true}
                         >{this.renderMenu()}</smu-menu>
                     </div>
                     : null}

                </div>
            </Host>
        );
    }

}
