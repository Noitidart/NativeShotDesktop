import { wait } from 'cmn/all'
import { takeEvery, call, put } from 'redux-saga/effects'

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
export function upAsync() {
    return {
        type: UP_ASYNC
    }
}
function* upAsyncHandler() {
    yield call(wait, 1000);
    yield put(up());
}
function* upAsyncSaga() {
    yield takeEvery(UP_ASYNC, upAsyncHandler);
}
sagas.push(upAsyncSaga);

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