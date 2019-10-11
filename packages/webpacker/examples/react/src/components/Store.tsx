import { injectable, postConstruct } from 'inversify';
import { computed, observable } from 'mobx';


@injectable()
export class Store {
    @observable layout = {
        headerSize: 70,
        footerSize: 70,
        leftSize  : 250,
        rightSize : 250,
        minHeight : window.innerHeight,
        set(key, value) {
            this[ key ] = value;
        },
    };

    @postConstruct()
    listen() {
        window.addEventListener('resize', ev => {
            this.layout.set('minHeight', window.innerHeight);
        });
    }
}
