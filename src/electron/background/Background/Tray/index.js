// @flow

import { Tray } from 'electron'
import { getFilePath } from '../../utils'
import { showWindow } from '../../../flows/windows'

import type { Shape as CoreShape } from '../../../flows/core'

let TRAY = null;

function init(dispatch, core: CoreShape) {
    console.log('INIT TRAY');
    if (TRAY) throw new Error('Tray is already initailized!');

    TRAY = new Tray(getFilePath('icons', 'icon16.png'));

    TRAY.on('click', handleClick.bind(null, dispatch));
}

function uninit() {
    console.log('UNINIT TRAY');
    if (!TRAY) throw new Error('Tray is destroyed!');

    TRAY.destroy();
    TRAY = null;
}

function handleClick(dispatch/*, e*/) {
    dispatch(showWindow('DASHBOARD'));
}

export { init, uninit }