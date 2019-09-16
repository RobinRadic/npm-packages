import { customElement } from 'lit-element';
import { NS } from '../shared/constants';


export function element(tagName: string): ClassDecorator {
    return customElement(NS + '-' + tagName) as any;
}
