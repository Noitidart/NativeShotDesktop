// @flow

import { app } from 'electron'

import type { Shape as QuitShape } from '../../../flow-control/quit'

let TRAY = null;

function Quit(quit: QuitShape) {
    if (quit) app.quit();
}

export default Quit