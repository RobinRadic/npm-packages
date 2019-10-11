///<reference path="globals.d.ts"/>
import './styling/stylesheet.scss';
import 'reflect-metadata'
import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { containerModule } from './container-module';
import { app } from './app';


export function start(id: string = 'app') {
    app.load(containerModule);
    ReactDOM.render(<App/>, document.getElementById(id));
}

