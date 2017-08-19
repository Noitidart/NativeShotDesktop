import { Client as ElectronClient } from '../comm/electron-client'
import { callInTemplate } from '../comm/comm'
import { renderProxiedElement } from '../comm/redux'

import Dashboard from './Dashboard'

const gBgComm = new ElectronClient(exports, 'app');
const callInBackground = callInTemplate.bind(null, gBgComm, null, null);

window.addEventListener('DOMContentLoaded', async function() {
    /*const unmount = */ await renderProxiedElement(callInBackground, 'gReduxServer', Dashboard, document.getElementById('root'), [
        'counter'
    ]);
}, false);

type Endpoints = {
    loadSettings?: () => void
}
export const ENDPOINTS:Endpoints = {};