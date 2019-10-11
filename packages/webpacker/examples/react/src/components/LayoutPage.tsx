import { hot } from 'react-hot-loader';
import React, { Component } from 'react';

@hot(module)
export class LayoutPage extends Component {
    render() {
        return (
            <div className="layout__page">
                {this.props.children}
            </div>
        );
    }
}
