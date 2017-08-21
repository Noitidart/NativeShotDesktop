// @flow

import { BrowserWindow } from 'electron'
import { getFilePath } from '../../utils'
import { closeWindow, WINDOW_STATES } from '../../../flows/windows'

import type { Shape as WindowsShape } from '../../../flows/windows'

import ICON from '../../../icons/icon16.png'

// WindowNames is defined by keys here:
const WINDOW_INFOS:WindowInfos = {
    DASHBOARD: {
        url: getFilePath('dashboard', 'index.html'),
        noMenu: true,
        backgroundColor: '#CCCCCC',
        width: 600,
        height: 600,
        icon: getFilePath('icons', 'icon16.png'),
        title: 'NativeShot | Dashboard'
    },
    KEEPALIVE: {
        show: false
    }
}

const SHOULD_LOAD_SETTINGS = { value:false };

type WindowName = string; // $Keys<typeof WINDOW_INFOS>; // for some reason this $Keys thing isnt working

type RelativeUri = string;
type BrowserWindowConfig = {}; // https://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions
type WindowInfos = {
    [WindowName]: {
        url?: RelativeUri,
        noMenu?: boolean,
        // ...BrowserWindowConfig // this causes build error, but it holds true
    }
}

type WindowRefs = { [WindowName]:* };
const WINDOW_REFS:WindowRefs = {}; // to hold to references

let DISPATCH;

function update(windows: WindowsShape, windowsOld: WindowsShape={}, dispatch) {
    DISPATCH = dispatch;
    // default on windowsOld because on mount it is undefined

    // state here is windowState
    for ( const [name, state] of Object.entries(windows)) {
        if (name in windowsOld) {
            const stateOld = windowsOld[name];
            if (state !== stateOld) {
                const window = WINDOW_REFS[name];
                switch (state) {
                    case WINDOW_STATES.HIDDEN: {
                        window.hide();

                        break;
                    }
                    case WINDOW_STATES.VISIBLE: {
                        window.show();
                        // if (window.isMinimized()) window.restore(); // seems this is not needed - tested on win10

                        break;
                    }
                    default: throw new Error(`Unknown window state of "${state}" for window named "${name}"`);
                }
            }
        } else {
            // newly created
            // if it didnt exist, and it was asked to go to "HIDDEN" redux reducer ignores its, so safe to assume that it is NOT in here with WINDOW_STATES.VISIBLE
            const { noMenu, ...browserWindowConfig } = WINDOW_INFOS[name];
            let { url } = WINDOW_INFOS[name]; // HACK: moved url out of const for SHOULD_LOAD_SETTINGS
            const window = WINDOW_REFS[name] = new BrowserWindow(browserWindowConfig);
            if (url && SHOULD_LOAD_SETTINGS.value) { url += '#settings'; SHOULD_LOAD_SETTINGS.value = false; } // HACK:
            if (url) window.loadURL(url);
            if (url) window.webContents.openDevTools(); // DEBUG: remove on build console.log(bleh)
            if (noMenu) window.setMenu(null);
            window.on('close', blockClose);
        }
    }

    // check if windows destoroyed
    for (const name of Object.keys(windowsOld)) {
        if (!(name in windows)) {
            const window = WINDOW_REFS[name];
            window.close(); // NOTE: assuming that content does NOT block close with `onbeforeunload`
            delete WINDOW_REFS[name];
        }
    }

}

function blockClose(e) {
    e.preventDefault();
    for (const [name, window] of Object.entries(WINDOW_REFS)) {
        if (window === e.sender) {
            window.removeListener('close', blockClose);
            DISPATCH(closeWindow(name));
            break;
        }
    }
}

export type { WindowName }
export { SHOULD_LOAD_SETTINGS }
export { update, WINDOW_REFS }