// @flow

import { app } from 'electron'

import type { Shape as QuitShape } from '../../../flows/quit'

let TRAY = null;

function Quit(quit: QuitShape) {
    if (quit) app.quit();
}

export default Quit