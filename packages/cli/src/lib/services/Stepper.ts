

import { container, lazyInject } from '@radic/console/types/@radic/console/src';
import { Cache } from '../core/cache';

export class StepperFactory {
    constructor(protected key:string){

    }

    create(key){

    }
}

export class Stepper {
    @lazyInject('r.cache')
    cache:Cache;

    constructor(protected key:string){

    }

    step() {}
}