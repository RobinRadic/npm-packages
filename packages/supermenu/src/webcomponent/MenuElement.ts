import { html, LitElement, property } from 'lit-element';
import { element } from './decorators';
import { NS } from '../constants';
import classNames from 'classnames';

@element('menu')
export class MenuElement extends LitElement {
    @property() foo = 'foo';

    constructor() {
        super();
        this.classList.add(classNames(
            `${NS}-menu`
        ))
    }

    render() {
        return html`<p>${this.foo}</p>`;
    }
}
