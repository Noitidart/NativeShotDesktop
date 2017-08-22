// @flow

import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { fork, all } from 'redux-saga/effects'

// import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
// import { offline } from 'redux-offline'
// import offlineConfigDefault from 'redux-offline/lib/defaults'
// import thunk from 'redux-thunk'

import core from './core'
import counter, { sagas as counterSagas } from './counter'
import tray from './tray'
import windows from './windows'
import quit from './quit'
import elements from '../comm/redux/elements' // ReduxComm reducer

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({core, tray, windows, elements, quit, counter});
const sagas = [ ...counterSagas ];

// const store = createStore(reducer, undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
// const store = createStore(combineReducers(reducers), undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
// const store = createStore(combineReducers(reducers), undefined, applyMiddleware(thunk));
const store = createStore(reducers, applyMiddleware(sagaMiddleware));


function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

export default store