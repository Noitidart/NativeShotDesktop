// @flow

import { app, BrowserWindow } from 'electron'
import { Server as ElectronServer } from '../comm/electron-server'
import { callInTemplate } from '../comm/comm'

import { wait } from 'cmn/all'

import path from 'path'
import url from 'url'

const gElectronComm = new ElectronServer(exports, function(channel) {
    console.log('server side handshake happend for channel:', channel);

    // // test to call into main, and not get a return value
    callInChannel(channel, 'testNoReturn2', 1);

    // // test to call into main, and get a return value
    callInChannel(channel, 'testReturn2', 1, function(arg) {
        console.log('back in main testReturn2, arg:', arg);
    });

    // test to call into main, and get callbacks, then fianlly return value
    callInChannel(channel, 'testReportProgress2', undefined, function(arg) {
        console.log('back in main testReportProgress2, arg:', arg);
    });

}); // eslint-disable-line no-unused-vars
const callInChannel = callInTemplate.bind(null, gElectronComm, null); // eslint-disable-line no-unused-vars
// export const callIn = (...args) => new Promise(resolve => exports['callIn' + args.shift()](...args, val=>resolve(val))); // must pass undefined for aArg if one not provided, due to my use of spread here. had to do this in case first arg is aMessageManagerOrTabId

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({ width:500, height:500, backgroundColor:'#CCC' });
    console.log('APP_PATH:', getPath('app', 'index.html'))
    mainWindow.loadURL(getPath('app', 'index.html'));
    mainWindow.webContents.openDevTools();
    // mainWindow.once('ready-to-show', () => mainWindow.show());
});

getPath.ROOT_PATH = 'C:\\Users\\Mercurius\\Documents\\GitHub\\NativeShotDesktop\\dist\\electron' // path.dirname(__dirname);
function getPath(...strs) {
    return url.format({
        pathname: path.join(getPath.ROOT_PATH, ...strs),
        protocol: 'file:',
        slashes: true
    });
}

// these three are setup to testing app calling into main
export function testNoReturn(arg) {
    console.log('in testNoReturn, arg:', arg);
}

export function testReturn(arg) {
    console.log('in testReturn! arg:', arg);
    return 'test';
}

export async function testReportProgress(arg, reportProgress) {
    reportProgress({ step:1 });
    reportProgress({ step:2 });
    await wait(1000);
    return { step:'done' };
}