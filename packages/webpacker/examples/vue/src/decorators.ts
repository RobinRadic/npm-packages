import 'reflect-metadata'
import Vue, { ComponentOptions, PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator, mixins } from 'vue-class-component'
import { componentFactory } from 'vue-class-component/lib/component'
import { InjectKey, PropType } from 'vue/types/options'
import { VueClass } from 'vue-class-component/lib/declarations';

export type Constructor = {
    new(...args: any[]): any
}
export { Component, Vue, mixins as Mixins }

/** Used for keying reactive provide/inject properties */
const reactiveInjectKey = '__reactiveInject__'

type InjectOptions = { from?: InjectKey; default?: any }

export function component<V extends Vue>(options: ComponentOptions<V> & ThisType<V> = {}): <VC extends VueClass<V>>(target: VC) => VC {
    if ( typeof options === 'function' ) {
        let Extended = componentFactory(options);
        return Extended as any
    }
    return function (Component) {
        let Extended = componentFactory(Component, options);
        if ( Component[ 'template' ] !== undefined ) {
            Extended = Extended.extend({ template: Component[ 'template' ] })
        }
        // if(Component.prototype.setupLogger !== undefined){
        //     Extended = Extended.extend({ setupLogger: Component.prototype.setupLogger })
        // }
        return Extended as any
    };
}

export function inject(options?: InjectOptions | InjectKey) {
    return createDecorator((componentOptions, key) => {
        if ( typeof componentOptions.inject === 'undefined' ) {
            componentOptions.inject = {}
        }
        if ( !Array.isArray(componentOptions.inject) ) {
            componentOptions.inject[ key ] = options || key
        }
    })
}

/**
 * decorator of a reactive inject
 * @param from key
 * @return PropertyDecorator
 */
export function rinject(options?: InjectOptions | InjectKey) {
    return createDecorator((componentOptions, key) => {
        if ( typeof componentOptions.inject === 'undefined' ) {
            componentOptions.inject = {}
        }
        if ( !Array.isArray(componentOptions.inject) ) {
            const fromKey    = !!options ? (options as any).from || options : key
            const defaultVal = (!!options && (options as any).default) || undefined
            if ( !componentOptions.computed ) componentOptions.computed = {}
            componentOptions.computed![ key ]            = function () {
                const obj = (this as any)[ reactiveInjectKey ]
                return obj ? obj[ fromKey ] : defaultVal
            } as any
            componentOptions.inject[ reactiveInjectKey ] = reactiveInjectKey
        }
    })
}

/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function provide(key?: string | symbol) {
    return createDecorator((componentOptions, k) => {
        let provide: any = componentOptions.provide
        if ( typeof provide !== 'function' || !provide.managed ) {
            const original  = componentOptions.provide
            provide         = componentOptions.provide = function (this: any) {
                let rv = Object.create(
                    (typeof original === 'function' ? original.call(this) : original) ||
                    null
                )
                for ( let i in provide.managed ) rv[ provide.managed[ i ] ] = this[ i ]
                return rv
            }
            provide.managed = {}
        }
        provide.managed[ k ] = key || k
    })
}

/**
 * decorator of a reactive provide
 * @param key key
 * @return PropertyDecorator | void
 */
export function rprovide(key?: string | symbol) {
    return createDecorator((componentOptions, k) => {
        let provide: any = componentOptions.provide
        if ( typeof provide !== 'function' || !provide.managed ) {
            const original  = componentOptions.provide
            provide         = componentOptions.provide = function (this: any) {
                let rv                  = Object.create(
                    (typeof original === 'function' ? original.call(this) : original) ||
                    null
                )
                rv[ reactiveInjectKey ] = {}
                for ( let i in provide.managed ) {
                    rv[ provide.managed[ i ] ] = this[ i ] // Duplicates the behavior of `@Provide`
                    Object.defineProperty(rv[ reactiveInjectKey ], provide.managed[ i ], {
                        enumerable: true,
                        get       : () => this[ i ]
                    })
                }
                return rv
            }
            provide.managed = {}
        }
        provide.managed[ k ] = key || k
    })
}

/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
const reflectMetadataIsSupported =
          typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined'

function applyMetadata(
    options: PropOptions | Constructor[] | Constructor,
    target: Vue,
    key: string
) {
    if ( reflectMetadataIsSupported ) {
        if (
            !Array.isArray(options) &&
            typeof options !== 'function' &&
            typeof options.type === 'undefined'
        ) {
            options.type = Reflect.getMetadata('design:type', target, key)
        }
    }
}

/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
export function model(
    event?: string,
    options: PropOptions | Constructor[] | Constructor = {}
) {
    return (target: Vue, key: string) => {
        applyMetadata(options, target, key)
        createDecorator((componentOptions, k) => {
            ;(componentOptions.props || ((componentOptions.props = {}) as any))[
                k
                ]                  = options
            componentOptions.model = { prop: k, event: event || k }
        })(target, key)
    }
}


export interface PropDecorator {
    (type: PropType<any>): PropertyDecorator

    (type: PropType<any>, defaultValue: any): PropertyDecorator

    (options: PropOptions): PropertyDecorator

    (options?: PropOptions | Constructor[] | Constructor): PropertyDecorator

    (...params): PropertyDecorator

}

export var prop: PropDecorator & {

    sync: (propName: string, options?: PropOptions | Constructor[] | Constructor) => PropertyDecorator
    required: PropDecorator
};
const propParams = (params: any[]) => {
    if ( params.length === 2 ) {
        return { type: params[ 0 ], default: params[ 1 ] }
    }
    return params[ 0 ];
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
prop = function (...params) {
    let options = propParams(params);
    return (target: Vue, key: string) => {
        applyMetadata(options, target, key)
        createDecorator((componentOptions, k) => {
            ;(componentOptions.props || ((componentOptions.props = {}) as any))[
                k
                ] = options
        })(target, key)
    }
} as any

prop.required = function (...params: any[]) {
    params           = propParams(params);
    let options: any = {
        required: true
    }
    if ( typeof params === 'function' ) {
        options.type = params
    } else if ( typeof params === 'object' ) {
        options = {
            ...params,
            ...options
        }
    }
    console.log({ options })
    return prop(options)
}

/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
prop.sync = function (propName: string, options: PropOptions | Constructor[] | Constructor = {}): PropertyDecorator {
    // @ts-ignore
    return (target: Vue, key: string) => {
        applyMetadata(options, target, key)
        createDecorator((componentOptions, k) => {
            ;(componentOptions.props || (componentOptions.props = {} as any))[
                propName
                ]                                                                 = options
            ;(componentOptions.computed || (componentOptions.computed = {}))[ k ] = {
                get() {
                    return (this as any)[ propName ]
                },
                set(value) {
                    // @ts-ignore
                    this.$emit(`update:${propName}`, value)
                }
            }
        })(target, key)
    }
}

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
export function watch(path: string, options: WatchOptions = {}) {
    const { deep = false, immediate = false } = options

    return createDecorator((componentOptions, handler) => {
        if ( typeof componentOptions.watch !== 'object' ) {
            componentOptions.watch = Object.create(null)
        }

        const watch: any = componentOptions.watch

        if ( typeof watch[ path ] === 'object' && !Array.isArray(watch[ path ]) ) {
            watch[ path ] = [ watch[ path ] ]
        } else if ( typeof watch[ path ] === 'undefined' ) {
            watch[ path ] = []
        }

        watch[ path ].push({ handler, deep, immediate })
    })
}

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate   = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export function emit(event?: string) {
    return function (_target: Vue, key: string, descriptor: any) {
        key              = hyphenate(key)
        const original   = descriptor.value
        descriptor.value = function emitter(...args: any[]) {
            const emit = (returnValue: any) => {
                if ( returnValue !== undefined ) args.unshift(returnValue)
                this.$emit(event || key, ...args)
            }

            const returnValue: any = original.apply(this, args)

            if ( isPromise(returnValue) ) {
                returnValue.then(returnValue => {
                    emit(returnValue)
                })
            } else {
                emit(returnValue)
            }

            return returnValue
        }
    }
}

/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
export function ref(refKey?: string) {
    return createDecorator((options, key) => {
        options.computed        = options.computed || {}
        options.computed[ key ] = {
            cache: false,
            get(this: Vue) {
                return this.$refs[ refKey || key ]
            }
        } as any
    })
}

function isPromise(obj: any): obj is Promise<any> {
    return obj instanceof Promise || (obj && typeof obj.then === 'function')
}
