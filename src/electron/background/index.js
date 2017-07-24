// @flow

import { app, BrowserWindow } from 'electron'

import { Server as ElectronServer } from '../comm/electron-server'
import { callInTemplate } from '../comm/comm'
import { Server as ReduxServer } from '../comm/redux'
import * as reducers from '../flows'

import { wait } from 'cmn/all' // eslint-disable-line no-unused-vars

import path from 'path'
import url from 'url'

import { addTodo, removeTodo } from '../flows/todos'

const gElectronComm = new ElectronServer(exports);
export const callInChannel = callInTemplate.bind(null, gElectronComm, null);
export const gReduxServer = new ReduxServer(reducers, Background);
const dispatch = gReduxServer.store.dispatch;

let mainWindow;
function handleReady() {
    mainWindow = new BrowserWindow({ width:500, height:500, backgroundColor:'#CCC' });
    console.log('APP_PATH:', getPath('app', 'index.html'))
    mainWindow.loadURL(getPath('app', 'index.html'));
    mainWindow.webContents.openDevTools();
    // mainWindow.once('ready-to-show', () => mainWindow.show());
}
app.on('ready', handleReady);

getPath.ROOT_PATH = 'C:\\Users\\Mercurius\\Documents\\GitHub\\NativeShotDesktop\\dist\\electron' // path.dirname(__dirname);
function getPath(...strs) {
    return url.format({
        pathname: path.join(getPath.ROOT_PATH, ...strs),
        protocol: 'file:',
        slashes: true
    });
}



function Background(state/*, stateOld, dispatch*/) {
    console.log('server side element re-rendered, state:', state);
}

console.log('PATH:', path.join(__dirname, '../'));

(async function() {
    await wait(10000);
    const info = dispatch(addTodo('say hi'));
    console.log('info:', info);

    await wait(1000);
    const info2 = dispatch(addTodo('say bye'));
    console.log('info2:', info2);

    await wait(10000);
    dispatch(removeTodo(info.id));
})();

