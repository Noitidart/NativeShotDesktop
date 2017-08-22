// @flow

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { AsyncNodeStorage } from 'redux-persist-node-storage'
import createSagaMiddleware from 'redux-saga'
import { reducer as form } from 'redux-form'
import { fork, all } from 'redux-saga/effects'

import { getFilePath } from '../background/utils'

import core from './core'
import counter, { sagas as counterSagas } from './counter'
import elements from '../comm/redux/elements'
import quit from './quit'
import rehydrated from './rehydrated'
import tray from './tray'
import windows from './windows'

import type { Shape as CoreShape } from './core'
import type { Shape as CounterShape } from './counter'
import type { Shape as ElementsShape } from '../comm/redux/elements'
import type { Shape as QuitShape } from './quit'
import type { Shape as RehydratedShape } from './rehydrated'
import type { Shape as TrayShape } from './tray'
import type { Shape as WindowsShape } from './windows'

export type Shape = {
    core: CoreShape,
    counter: CounterShape,
    elements: ElementsShape,
    form: *,
    quit: QuitShape,
    rehydrated: RehydratedShape,
    tray: TrayShape,
    windows: WindowsShape
}

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ core, counter, elements, form, quit, rehydrated, tray, windows });
const sagas = [ ...counterSagas ];

const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware), autoRehydrate()));

function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

console.log('getFilePath(storage):', getFilePath('storage'));

export const persistor = persistStore(store, {
    // blacklist: ['elements', 'form', 'rehydrated'],
    whitelist: ['counter'],
    storage: new AsyncNodeStorage(getFilePath('..', 'storage'))
});

// store.subscribe(function() {
//     console.log('store updated:', store.getState());
// })

export default store