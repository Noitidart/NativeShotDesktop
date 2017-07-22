// @flow

import { app, BrowserWindow } from 'electron'

// type Rawr = number;
// const hi: Rawr = 1;

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({ width:500, height:500, backgroundColor:'#CCC' });
    mainWindow.once('ready-to-show', () => mainWindow.show());
});