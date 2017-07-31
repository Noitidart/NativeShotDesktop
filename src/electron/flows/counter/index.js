import { wait } from 'cmn/all'
import { takeEvery, take, call, put, select } from 'redux-saga/effects'

export type Shape = number;

const INITIAL = 10;
export const sagas = [];

const UP = 'UP';
export function up() {
    return {
        type: UP
    }
}

const UP_ASYNC = 'UP_ASYNC';
export function upAsync(times) {
    return {
        type: UP_ASYNC,
        times
    }
}

function* upAsyncWorker(action) {
    console.log('action:', action);
    for (let i=0; i<action.times; i++) {
        const state = yield select();
        console.log('state:', state);
        yield call(wait, 1000);
        yield put(up());
    }
}
function* upAsyncWatcher() {
    yield takeEvery(UP_ASYNC, upAsyncWorker);
}
sagas.push(upAsyncWatcher);

/*function* upAsyncSaga() {
    while (true) {
        const action = yield take(UP_ASYNC);
        for (let i=0; i<action.times; i++) {
            const state = yield select();
            console.log('state:', state);
            yield call(wait, 1000);
            yield put(up());
        }
    }
}
sagas.push(upAsyncSaga);
 */
const DN = 'DN';
export function dn() {
    return {
        type: DN
    }
}

export default function reducer(state:Shape=INITIAL, action) {
    switch(action.type) {
        case UP: return state + 1;
        case DN: return state - 1;
        default: return state;
    }
}