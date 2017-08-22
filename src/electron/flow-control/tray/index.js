// @flow

export type Shape = null | {}

const INITIAL = {}

export default function tray(state:Shape=INITIAL, action) {
    switch(action.type) {
        default: return state;
    }
}