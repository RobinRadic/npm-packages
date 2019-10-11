import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { LayoutHeader } from './LayoutHeader';
import { Layout } from './Layout';
import { LayoutSide } from './LayoutSide';
import { LayoutPage } from './LayoutPage';
import { LayoutFooter } from './LayoutFooter';

@hot
class App extends Component {
    render() {
        return (
            <Layout>
                <LayoutHeader>Header</LayoutHeader>
                <LayoutSide>Side</LayoutSide>
                <LayoutPage>Page</LayoutPage>
                <LayoutFooter>Footer</LayoutFooter>
            </Layout>
        );
    }
}

export default App; // hot(App);
