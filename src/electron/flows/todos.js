const ADD = 'ADD';
let nexttodoid = 0;
export function addTodo(txt) {
    return {
        type: ADD,
        txt,
        id: nexttodoid++
    }
}

const REMOVE = 'REMOVE';
export function removeTodo(id) {
    return {
        type: REMOVE,
        id
    }
}

export default function todos(state=[], action) {
    let type;
    ({type, ...action} = action);
    switch(type) {
        case ADD: {
            let item = action;
            return [...state, item];
        }
        case REMOVE: {
            let { id } = action;
            return state.filter(item => item.id !== id);
        }
        default:
            return state;
    }
}