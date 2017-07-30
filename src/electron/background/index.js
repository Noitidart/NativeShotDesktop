// @flow

import { app, Tray } from 'electron'

import { Server as ElectronServer } from '../comm/electron-server'
import { callInTemplate } from '../comm/comm'
import { Server as ReduxServer } from '../comm/redux'
import store from '../flows'

import Background from './Background'

// gElectronComm is needed because gReduxServer gets incoming through this. Meaning "things like ./app use callInBackground to connect to redux server"
const gElectronComm = new ElectronServer(exports);
export const callInChannel = callInTemplate.bind(null, gElectronComm, null);
export let gReduxServer;

app.on('ready', function() {
    gReduxServer = new ReduxServer(store, Background); // so it is safe for all elements in Background to assume that app is ready. because lots of things, like Tray etc need app to be ready first
});