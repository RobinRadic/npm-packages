import '../scss/demo.vendor.scss';
import '../scss/demo.scss';
import $ from 'cash-dom';
import { Cash } from 'cash-dom';
import { Menu, MenuOptions } from './native';
import debug from 'debug';

declare module 'cash-dom' {
    interface Cash {
        menu(options?: MenuOptions): Cash

        menu(options: 'instance'): Menu
    }
}

const log           = debug('supermenu:demo');
export let dbg: any = {};

$.fn.menu = function (this: Cash, options?: any) {
    if ( options === 'instance' ) {
        return this.get(0).__menu;
    }
    this.each((index, ele) => {
        const menu = new Menu(ele, options);
        ele.__menu = menu;
        log('menu on ', { ele, menu });
    });
    return this;
};

export function init(selector) {
    const $el = $(selector);
    log('init', { selector }, { $el });

    $el.menu({
        disableIcons:true,
        // on: {
        //     '**': function(...args){
        //         log('on *', ...args)
        //     }
        // }
    });

    $('[data-menu-action]').on('click', function (this: Cash, event: MouseEvent, data) {
        event.stopPropagation();
        event.preventDefault();
        const $self      = $(this);
        const action     = $self.data('menu-action');
        const params     = $self.data('menu-action-params') || [];
        const menu: Menu = $el.menu('instance');
        dbg.menu         = menu;
        log('click', $self.data(), { action, params, menu });
        let $node = menu.node.get(params[ 0 ]);
        log('$node', window[ '$node' ] = $node);
        $node.select().getAncestorsAndSelf().without([ $node.root() ]).expand();
        dbg.$node = $node;

    });
    return $el;

}


window[ 'jQuery' ] = $;
$[ 'version' ]     = '3.1.1';

