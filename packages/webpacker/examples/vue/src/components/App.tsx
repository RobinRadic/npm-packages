import { CreateElement } from 'vue';
import component from 'vue-class-component';
import { Component } from '#/Component';
import { Header } from '#/Header';


@component({})
export class App extends Component {
    render(h: CreateElement) {
        return (
            <div>
                This is <strong>The div</strong>
            </div>
        );
    }
}
