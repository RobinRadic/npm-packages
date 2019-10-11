import { Component } from '#/Component';
import { VNode } from 'vue';
import { component, prop } from '@/decorators';

export interface HeaderProps {
    height?: number
}


@component()
export class Header extends Component<HeaderProps> {
    @prop(Number) height: number;

    render(h): VNode {
        this.height = 3;

        return (
            <div>
                {this.$slots.default}
            </div>
        );
    }
}
