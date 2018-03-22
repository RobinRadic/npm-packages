/**
 * @license
 * Mixiner <https://shvabuk.github.io/mixiner>
 * Released under MIT license <https://shvabuk.github.io/mixiner/LICENSE.txt>
 * Copyright Shvab Ostap
 */
import { IMixiner, IPropertyKey, IPrototypeableClass } from './interfaces';


function define(
    target: IPrototypeableClass,
    mixin: IPrototypeableClass,
    propertyName: IPropertyKey
): void {
    Object.defineProperty(target, propertyName, Object.getOwnPropertyDescriptor(mixin, propertyName));
}

// get props names, used in mixin
function getOwnPropsKeys(target: IPrototypeableClass): IPropertyKey[] {
    const keys = Object.getOwnPropertyNames(target);
    if (typeof Object.getOwnPropertySymbols !== 'undefined') {
        return [].concat(keys, Object.getOwnPropertySymbols(target));
    }
    return keys;
}

export const Mixin: IMixiner = function mixiner(mixin: IPrototypeableClass) {
    return <T>(baseCtor: any): T => {
        getOwnPropsKeys(mixin.prototype)
            .filter((name: IPropertyKey) => name !== 'constructor')
            .forEach((name: IPropertyKey) => {
                define(baseCtor.prototype, mixin.prototype, name);
            });
        return baseCtor;
    };
};
