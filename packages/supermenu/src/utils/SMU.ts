import { Menu } from '@menu';
import { h } from '@stencil/core';
import * as  d from '@stencil/core/dist/declarations';
import { slugify } from '#/slugify';
import { bindEventEmitter, BoundEmitter, createEventEmitter } from './eventEmitter';
import * as constants from './constants';

const events          = createEventEmitter();
export const SMU: SMU = {
    instances         : {},
    h                 : h as any as typeof h.h,
    renderIcon(icon: string, data: d.VNodeData = {}): d.VNode {
        data.class                    = data.class || {};
        data.class[ 'fa fa-' + icon ] = true;
        this.emit('renderIcon', data)
        return this.h('i', data);
    },
    registerMenu(menu: Menu) {
        if ( !menu.slug ) {
            throw new Error('Menu slug missing');
        }
        this.instances[ menu.slug ] = menu;
        this.emit('registerMenu', menu)
    },
    constants         : constants,
    slugify           : slugify,
    bindEventEmitter  : bindEventEmitter,
    createEventEmitter: createEventEmitter,
};
bindEventEmitter(events, SMU);

export interface SMU extends Partial<BoundEmitter> {
    instances: Record<string, Menu>
    h: typeof h.h

    renderIcon(icon: string, data?: d.VNodeData): d.VNode

    registerMenu(menu: Menu)

    constants: typeof constants
    slugify: typeof slugify
    bindEventEmitter: typeof bindEventEmitter
    createEventEmitter: typeof createEventEmitter
}

window[ 'SMU' ] = SMU;
