// @flow

export type Shape = boolean;

const INITIAL = false;

const QUIT = 'QUIT';
export function quit() {
    return {
        type: QUIT
    }
}

export default function reducer(state:Shape=INITIAL, action) {
    switch(action.type) {
        case QUIT: return true;
        default: return state;
    }
}