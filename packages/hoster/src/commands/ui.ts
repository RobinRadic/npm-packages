import { BaseCommand } from '../lib';
import {app,BrowserWindow} from 'electron'

const log = require('debug')('UICommand')
export default class UiCommand extends BaseCommand {
    static description = 'Restart the services';

    async run() {
        this.out.line('Starting UI');

        app.on('ready', (event, launchInfo) => {
            log('ready',{event, launchInfo})
        })

        app.whenReady().then(() => {
            const win = new BrowserWindow({
                width         : 800,
                height        : 600,
                webPreferences: {
                    nodeIntegration: true
                }
            })
            win.loadFile('index.html')
        });
    }
}

