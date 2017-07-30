// @flow

import { BrowserWindow } from 'electron'
import { getFilePath } from '../../utils'
import { closeWindow, WINDOW_STATES } from '../../../flows/windows'

import type { Shape as WindowsShape } from '../../../flows/windows'

// WindowNames is defined by keys here:
const WINDOW_INFOS:WindowInfos = {
    DASHBOARD: {
        url: getFilePath('app', 'index.html'),
        noMenu: true,
        backgroundColor: '#CCCCCC',
        width: 600,
        height: 600,
        icon: getFilePath('icons', 'icon16.png')
    }
}

type WindowName = string; // $Keys<typeof WINDOW_INFOS>; // for some reason this $Keys thing isnt working

type RelativeUri = string;
type BrowserWindowConfig = {}; // https://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions
type WindowInfos = {
    [WindowName]: {
        url: RelativeUri,
        noMenu: boolean,
        // ...BrowserWindowConfig // this causes build error, but it holds true
    }
}

type WindowRefs = { [WindowName]:* };
const WINDOW_REFS:WindowRefs = {}; // to hold to references

function update(windows: WindowsShape, windowsOld: WindowsShape, dispatch) {

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
            const { noMenu, url, ...browserWindowConfig } = WINDOW_INFOS[name];
            const window = WINDOW_REFS[name] = new BrowserWindow(browserWindowConfig);
            window.loadURL(url);
            if (noMenu) window.setMenu(null);
            window.on('close', handleClose.bind(null, dispatch, name));
        }
    }

    // check if windows destoroyed
    if (windowsOld) { // on mount old is undefined
        for (const name of Object.keys(windowsOld)) {
            if (!(name in windows)) {
                const window = WINDOW_REFS[name];
                window.destroy();
                delete WINDOW_REFS[name];
            }
        }
    }

}

function handleClose(dispatch, name, e) {
    e.preventDefault();
    dispatch(closeWindow(name))
}

export type { WindowName }
export { update, WINDOW_REFS }