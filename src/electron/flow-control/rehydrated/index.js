// @flow
import { REHYDRATE } from 'redux-persist/constants'

export type Shape = boolean;

const INITIAL = false;

type RehydrateAction = { type:REHYDRATE, payload:{}, error:null };

type Action = RehydrateAction;

export default function reducer(state: Shape = INITIAL, action:Action) {
    switch(action.type) {
        case REHYDRATE: return true; // i dont care if error happens on rehydrate, but if it does, maybe i should purge the store TODO:
        default: return state;
    }
}