import { html, LitElement, property } from 'lit-element';
import { element } from './decorators';

@element('menu')
export class MenuElement extends LitElement {
    @property()
    foo = 'foo';

    render() {
        return html`<p>${this.foo}</p>`;
    }
}
