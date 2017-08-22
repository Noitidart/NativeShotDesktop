// @flow

export type Shape = boolean;

const INITIAL = false;

const A = ([actionType]: string[]) => 'QUIT_' + actionType; // Action type prefixer

//
const QUIT = A`QUIT`;
type QuitAction = { type:typeof QUIT };
export function quit(): QuitAction {
    return {
        type: QUIT
    }
}

//
type Action =
  | QuitAction;

export default function reducer(state: Shape = INITIAL, action:Action) {
    switch(action.type) {
        case QUIT: return true;
        default: return state;
    }
}