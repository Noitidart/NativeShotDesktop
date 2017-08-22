type Serializable = any; // but really not any, its anything that is serializable
type WantedState = { [string]:Serializable }
type Shape = Array<{
    id: number,
    wanted: string[],
    setState: WantedState => void
}>
const INITIAL = [];

// ACTIONS and REDUCER
const ADD_ELEMENT = 'ADD_ELEMENT';
export function addElement(id, wanted, setState) {
    // NOTE: id must be a string because i use it as a react key crossfile-link3138470
    // wanted array of dotpaths, to deepAccessUsingString on redux store/state
    return {
        type: ADD_ELEMENT,
        id,
        wanted,
        setState
    }
}

const REMOVE_ELEMENT = 'REMOVE_ELEMENT';
export function removeElement(id, dontUnmount) {
    return {
        type: REMOVE_ELEMENT,
        id,
        dontUnmount
    }
}

export default function reducer(state=INITIAL, action) {
    const { type, ...rest } = action;
    switch(type) {
        case ADD_ELEMENT: {
            const element = rest;
            const { id } = element;
            const hasElement = state.find( element => element.id === id );
            return hasElement ? state : [...state, element];
        }
        case REMOVE_ELEMENT: {
            const { id } = rest;
            const stateNew = state.filter(element => element.id !== id);
            const didRemove = stateNew.length !== state.length;
            return didRemove ? stateNew : state;
        }
        default:
            return state;
    }
}