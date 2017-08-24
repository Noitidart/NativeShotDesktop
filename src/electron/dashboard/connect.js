import { Client as ElectronClient } from 'cmn/lib/comm/electron-client'
import { callInTemplate } from 'cmn/lib/comm/comm'
import proxyFactory from 'cmn/lib/comm/redux/proxy-hoc'

type Endpoints = {
    loadSettings?: () => void
}

const ENDPOINTS:Endpoints = {};

const gBgComm = new ElectronClient(exports, 'app');
const callInBackground = callInTemplate.bind(null, gBgComm, null, null);

const proxy = proxyFactory.bind(null, callInBackground, 'gReduxServer');

export { ENDPOINTS }
export default proxy