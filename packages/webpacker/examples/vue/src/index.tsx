import 'reflect-metadata'
import Vue from 'vue';
import { App } from '@/components/App';


window[ 'Vue' ] = Vue;

export { Vue, App };

export function start(id='#app') {
    let app = new Vue({
        render: h => h(App),
    });
    app.$mount(id);
}

