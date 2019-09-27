import { customElement, property } from 'lit-element';
import { NS } from '../constants';
import { PropertyDeclaration } from 'lit-element/src/lib/updating-element';


export function element(tagName: string): ClassDecorator {
    return customElement(NS + '-' + tagName) as any;
}


export type PropDecoratorFn = (options?: PropertyDeclaration) => any

export interface PropDecorator {
    (options?: PropertyDeclaration, overrides?: PropertyDeclaration): any

    string?: PropDecoratorFn
    number?: PropDecoratorFn
    boolean?: PropDecoratorFn
    array?: PropDecoratorFn
    object?: PropDecoratorFn
}

export let prop: PropDecorator;

prop = function (options: PropertyDeclaration = {}, overrides: PropertyDeclaration = {}) {
    const defaults: PropertyDeclaration = {};

    return property({ ...defaults, ...options, ...overrides });
};

let propTypeMap: Record<string, Function> = {
    string : String,
    number : Number,
    boolean: Boolean,
    array  : Array,
    object : Object,
};
for ( let key in propTypeMap ) {
    let fn      = propTypeMap[ key ];
    prop[ key ] = function (options: PropertyDeclaration = {}) {
        return prop(options, { type: fn });
    };
}
