import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { Store } from './Store';
import { inject } from '@/app';
import { observer } from 'mobx-react';

@hot(module)
@observer
export class LayoutFooter extends Component {
    @inject(Store) store:Store;

    render() {
        return (
            <div className="layout__footer" style={{ height: this.store.layout.footerSize }}>
                {this.props.children}
            </div>
        );
    }
}
