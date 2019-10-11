import { hot } from 'react-hot-loader';
import React, { Component } from 'react';

@hot(module)
export class LayoutSide extends Component {
    render() {
        return (
            <div className="layout__side layout__side--left">
                {this.props.children}
            </div>
        );
    }
}
