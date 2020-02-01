import { Application } from '../core/Application';
import { Extension }   from '../interfaces';

export abstract class AbstractExtension implements Extension {
    get slack() {return this.app.slack;}

    get config() {return this.app.config;}

    constructor(public app: Application) {}
}
