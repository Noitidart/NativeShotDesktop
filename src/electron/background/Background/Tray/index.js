// @flow

import { Tray, Menu } from 'electron'

import { getFilePath } from '../../utils'
import { showWindow } from '../../../flows/windows'
import { quit } from '../../../flows/quit'
import { WINDOW_REFS } from '../Windows'

import type { Shape as CoreShape } from '../../../flows/core'

let TRAY = null;

function init(dispatch, core: CoreShape) {
    console.log('INIT TRAY');
    if (TRAY) throw new Error('Tray is already initailized!');

    TRAY = new Tray(getFilePath('icons', 'icon16.png'));

    const launchDashboard = handleClick.bind(null, dispatch);
    TRAY.on('click', launchDashboard);

    const menu = Menu.buildFromTemplate([
        { label: 'Dashboard', click:launchDashboard },
        { label: 'Quit', click:handleQuit.bind(null, dispatch) }
    ]);

    TRAY.setContextMenu(menu);
}

function uninit() {
    console.log('UNINIT TRAY');
    if (!TRAY) throw new Error('Tray is destroyed!');

    TRAY.destroy();
    TRAY = null;
}

function handleClick(dispatch/*, e*/) {

    dispatch(showWindow('DASHBOARD'));

    // because kicking of showWindow action will not do anything, as state really doest change, i do this redux bypass HACK:
    const window = WINDOW_REFS.DASHBOARD;
    if (window) {
        window.show();
        // if (window.isMinimized()) window.restore(); // seems this is not needed - tested on win10
    }
}

function handleQuit(dispatch) {
    dispatch(quit());
}

export { init, uninit }