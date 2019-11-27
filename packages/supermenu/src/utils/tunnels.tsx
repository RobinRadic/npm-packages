
import { h } from '@stencil/core';
import {createContext } from 'stencil-context';
import { Menu } from '@menu';
import { MenuItem } from '@menu-item';

export interface MenuTunnelState {
    menu?:Menu
}
// export const MenuTunnel = createProviderConsumer<MenuTunnelState>({
//
// }, (subscribe, renderer) => (
//     <context-consumer subscribe={subscribe} renderer={renderer} />
// ))

export interface ParentItemTunnelState {
    parentItem?:MenuItem|Menu
}
// export const ParentItemTunnel = createProviderConsumer<ParentItemTunnelState>({
//
// }, (subscribe, renderer) => (
//     <context-consumer subscribe={subscribe} renderer={renderer} />
// ))


export const MenuTunnel = createContext({menu:null})
export const ParentItemTunnel = createContext({parentItem:null})
