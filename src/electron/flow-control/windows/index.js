// @flow

import type { WindowName } from '../../background/Background/Windows'

export type Shape = {
    [key:WindowName]: WindowState // if name does not exist in here, it is a non-existant window (ie: destroyed)
}

const INITIAL = {
    KEEPALIVE: 'VISIBLE'
}

const WINDOW_STATES = {
    HIDDEN: 'HIDDEN',
    VISIBLE: 'VISIBLE'
}
type WindowState = $Keys<typeof WINDOW_STATES>; // eslint-disable-line no-undef

const A = ([actionType]: string[]) => 'WINDOWS_' + actionType; // Action type prefixer

//
const SHOW = A`SHOW`;
type ShowAction = { type:typeof SHOW , name: WindowName };
export function showWindow(name: WindowName): ShowAction {
    // window is created if it is not hidden
    return {
        type: SHOW,
        name
    }
}

//
const HIDE = A`HIDE`;
type HideAction = { type:typeof HIDE, name: WindowName };
export function hideWindow(name: WindowName): HideAction {
    // window is not created, if it is not found to exist
    return {
        type: HIDE,
        name
    }
}

//
const CLOSE = A`CLOSE`;
type CloseAction = { type:typeof CLOSE, name: WindowName };
export function closeWindow(name: WindowName): CloseAction {
    return {
        type: CLOSE,
        name
    }
}

//
type Action =
  | ShowAction
  | HideAction
  | CloseAction;

export default function reducer(state: Shape = INITIAL, action:Action) {
    switch(action.type) {
        case SHOW: {
            const { name } = action;

            // if "already visible" or "does not exist" (state[name] is undefined due to missing)
            return state[name] === WINDOW_STATES.VISIBLE ? state : {...state, [name]:WINDOW_STATES.VISIBLE };
        }
        case HIDE: {
            const { name } = action;

            // if it is not "visible" OR does not exist, do nothing
            return state[name] === WINDOW_STATES.VISIBLE || !(name in state) ? state : {...state, [name]:WINDOW_STATES.HIDDEN }
        }
        case CLOSE: {
            const { name } = action;

            if (name in state) {
                const stateNew = {...state};
                delete stateNew[name];
                return stateNew;
            } else {
                // already "does not exist"
                return state;
            }
        }
        default: return state;
    }
}

export { WINDOW_STATES }