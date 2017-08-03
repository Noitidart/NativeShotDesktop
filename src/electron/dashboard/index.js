import { Client as ElectronClient } from '../comm/electron-client'
import { callInTemplate } from '../comm/comm'
import { renderProxiedElement } from '../comm/redux'

import App from './App'

import './theme-a.default.css'
import './index.css'

console.error('ENTER');

const gBgComm = new ElectronClient(exports, 'app');
const callInBackground = callInTemplate.bind(null, gBgComm, null, null);

window.addEventListener('DOMContentLoaded', async function() {
    /*const unmount = */ await renderProxiedElement(callInBackground, 'gReduxServer', App, document.getElementById('root'), [
        'counter'
    ]);
}, false);
