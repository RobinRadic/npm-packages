import { html, LitElement, property } from 'lit-element';
import { element } from './decorators';
import { NS } from '../constants';
import classNames from 'classnames';

@element('menu-item')
export class MenuItemElement extends LitElement {
    @property() label = 'foo';

    constructor() {
        super();
        this.classList.add(classNames(
            `${NS}-menu__item`
        ))
    }
    createRenderRoot() {
        return this;
    }
    render() {
        return html`<a class="${NS}-menu__type">
        <span class="${NS}-menu__icon"></span>
        <span class="${NS}-menu__title">${this.label}</span>
        <span class="${NS}-menu__arrow"><i></i></span>       
        </a>
        <ul class="${NS}-menu__submenu"><slot></slot></ul>
        `;
    }
}
