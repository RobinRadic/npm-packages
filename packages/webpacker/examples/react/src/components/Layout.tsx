import './layout.scss';
import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { inject } from '../app';
import { Store } from './Store';

export let {Consumer,Provider} = React.createContext(null);



@hot(module)
@observer
export class Layout extends Component {
    @inject(Store) store;

    render() {
        return (
            <div className="layout" style={{ minHeight: this.store.layout.minHeight }}>
                <Provider value={this}>
                    {this.props.children}
                </Provider>
            </div>
        );
    }
}
