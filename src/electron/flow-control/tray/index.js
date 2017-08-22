// @flow

export type Shape = null | {};

const INITIAL = {};

const A = ([actionType]: string[]) => 'TRAY_' + actionType; // Action type prefixer

//
type Action = {};

export default function reducer(state: Shape = INITIAL, action:Action) {
    switch(action.type) {
        default: return state;
    }
}