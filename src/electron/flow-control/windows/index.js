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

const SHOW_WINDOW = 'SHOW_WINDOW';
export function showWindow(name: WindowName) {
    // window is created if it is not hidden
    return {
        type: SHOW_WINDOW,
        name
    }
}

const HIDE_WINDOW = 'HIDE_WINDOW';
export function hideWindow(name: WindowName) {
    // window is not created, if it is not found to exist
    return {
        type: HIDE_WINDOW,
        name
    }
}

const CLOSE_WINDOW = 'CLOSE_WINDOW';
export function closeWindow(name: WindowName) {
    return {
        type: CLOSE_WINDOW,
        name
    }
}

export default function windows(state:Shape=INITIAL, action) {
    switch(action.type) {
        case SHOW_WINDOW: {
            const { name } = action;

            // if "already visible" or "does not exist" (state[name] is undefined due to missing)
            return state[name] === WINDOW_STATES.VISIBLE ? state : {...state, [name]:WINDOW_STATES.VISIBLE };
        }
        case HIDE_WINDOW: {
            const { name } = action;

            // if it is not "visible" OR does not exist, do nothing
            return state[name] === WINDOW_STATES.VISIBLE || !(name in state) ? state : {...state, [name]:WINDOW_STATES.HIDDEN }
        }
        case CLOSE_WINDOW: {
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