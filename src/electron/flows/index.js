// @flow

import { createStore, combineReducers } from 'redux'

// import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
// import { offline } from 'redux-offline'
// import offlineConfigDefault from 'redux-offline/lib/defaults'
// import thunk from 'redux-thunk'

import core from './core'
import tray from './tray'
import windows from './windows'
import quit from './quit'
import elements from '../comm/redux/elements' // ReduxComm reducer

const reducers = combineReducers({core, tray, windows, elements, quit});


// const store = createStore(reducer, undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
// const store = createStore(combineReducers(reducers), undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
// const store = createStore(combineReducers(reducers), undefined, applyMiddleware(thunk));
const store = createStore(reducers);

export default store