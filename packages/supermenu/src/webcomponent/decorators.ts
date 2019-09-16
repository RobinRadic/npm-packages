import { customElement } from 'lit-element';
import { NAMESPACE } from '../shared/constants';


export function element(tagName: string): ClassDecorator {
    return customElement(NAMESPACE + '-' + tagName) as any;
}
