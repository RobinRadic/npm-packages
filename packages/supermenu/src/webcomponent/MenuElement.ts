import { html, LitElement, property } from 'lit-element';
import { element, prop } from './decorators';
import { NS } from '../constants';
import classNames from 'classnames';

@element('menu')
export class MenuElement extends LitElement {
    @prop.string() foo = 'foo';

    constructor() {
        super();
        this.classList.add(classNames(
            `${NS}-menu`
        ))
    }
    createRenderRoot() {
        return this;
    }
    render() {
        return html`
         <ul><slot></slot></ul>
        `;
    }
}
