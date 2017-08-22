// @flow

import { depth0Or1Equal } from 'cmn/lib/recompose'

import * as Tray from './Tray'
import * as Windows from './Windows'
import Quit from './Quit'

import type { Shape as TrayShape } from '../../flow-control/tray'
import type { Shape as CoreShape } from '../../flow-control/core'
import type { Shape as WindowsShape } from '../../flow-control/windows'
import type { Shape as QuitShape } from '../../flow-control/quit'

type State = {
    tray: TrayShape,
    core: CoreShape,
    windows: WindowsShape,
    quit: QuitShape
}

Background.wantedState = ['tray', 'core', 'windows', 'quit'];
function Background(state: State, stateOld: State, dispatch) {
    console.log('IN BACKGROUND RENDER');

    const { tray } = state;
    const { tray:trayOld } = stateOld;
    if (!depth0Or1Equal(tray, trayOld)) {
        if (tray) {
            Tray.init(dispatch, state.core);
        } else {
            Tray.uninit();
        }
    }

    const { windows } = state;
    const { windows:windowsOld } = stateOld;
    if (!depth0Or1Equal(windows, windowsOld)) {
        Windows.update(windows, windowsOld, dispatch);
    }

    const { quit } = state;
    Quit(quit);

}

export default Background