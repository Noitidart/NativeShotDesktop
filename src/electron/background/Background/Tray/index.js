// @flow

import { Tray, Menu } from 'electron'

import { getFilePath } from '../../utils'
import { showWindow } from '../../../flows/windows'
import { quit } from '../../../flows/quit'
import { WINDOW_REFS } from '../Windows'

import { callInChannel } from '../../' // HACK:
import { SHOULD_LOAD_SETTINGS } from '../Windows'

import ICON from '../../../icons/icon16.png'

import type { Shape as CoreShape } from '../../../flows/core'

let TRAY = null;
let DISPATCH;

function init(dispatch, core: CoreShape) {
    console.log('INIT TRAY');
    if (TRAY) throw new Error('Tray is already initailized!');

    DISPATCH = dispatch;

    TRAY = new Tray(getFilePath('icons', 'icon16.png'));

    TRAY.on('click', launchDashboard);

    const menu = Menu.buildFromTemplate([
        { label:'Settings', click:launchSettings },
        { label:'Dashboard', click:launchDashboard },
        { label:'Quit', click:handleQuit }
    ]);

    TRAY.setContextMenu(menu);
}

function uninit() {
    console.log('UNINIT TRAY');
    if (!TRAY) throw new Error('Tray is destroyed!');

    TRAY.destroy();
    TRAY = null;
}

function launchDashboard() {

    DISPATCH(showWindow('DASHBOARD'));

    // because kicking of showWindow action will not do anything, as state really doest change, i do this redux bypass HACK:
    const window = WINDOW_REFS.DASHBOARD;
    if (window) {
        window.show();
        // if (window.isMinimized()) window.restore(); // seems this is not needed - tested on win10
    }
}

function launchSettings() {
    // redux bypass HACK:
    const window = WINDOW_REFS.DASHBOARD;
    if (window) {
        window.show();
        callInChannel(window.webContents, 'ENDPOINTS.loadSettings');
    } else {
        SHOULD_LOAD_SETTINGS.value = true;
        DISPATCH(showWindow('DASHBOARD'));
    }
}

function handleQuit() {
    DISPATCH(quit());
}

export { init, uninit }