import { Client as ElectronClient } from '../comm/electron-client'
import { callInTemplate } from '../comm/comm'
import proxyFactory from '../comm/redux/proxy-hoc'

type Endpoints = {
    loadSettings?: () => void
}

const ENDPOINTS:Endpoints = {};

const gBgComm = new ElectronClient(exports, 'app');
const callInBackground = callInTemplate.bind(null, gBgComm, null, null);

const proxy = proxyFactory.bind(null, callInBackground, 'gReduxServer');

export { ENDPOINTS }
export default proxy