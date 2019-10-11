import { hot } from 'react-hot-loader';
import React, { Component } from 'react';

@hot(module)
export class LayoutHeader extends Component {
    render() {
        return (
            <div className="layout__header">
                {this.props.children}
            </div>
        );
    }
}
