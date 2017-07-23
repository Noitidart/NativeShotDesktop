// TODO: figure out how to make redux-offline only persist some keys, like there is no reason to persist messages
import React from 'react'
import { combineReducers, createStore } from 'redux'
import { render, unmountComponentAtNode } from 'react-dom'
import { shallowEqual } from 'cmn/recompose' // eslint-disable-line no-unused-vars
import { deepAccessUsingString } from 'cmn/all'
// import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
// import { offline } from 'redux-offline'
// import offlineConfigDefault from 'redux-offline/lib/defaults'
// import thunk from 'redux-thunk'


import elements from './elements'
import { removeElement, addElement } from './elements'

import Proxy from './Proxy'

function renderProxiedElement(callInReduxScope, server_name, component, container, wanted) {
    // this should imported and executed in the dom where we want to render the html element
    // if ReduxServer is in same scope, set callInReduxPath to gReduxServer
    // resolves with elementid - so dever can use with dispatch(removeElement(id)) --- actually i changed it, it resolves with a helper function which internally does dispatch(removeElement(id)), see link7884721
    // component - react class
    // container - dom target - document.getElementById('root')
    // wanted - wanted state
    // store.dispatch(addElement('todo', component.name, wanted));    if (Array.isArray(callInReduxPath)) {

    const callInRedux = (method, ...args) => callInReduxScope(server_name + '.' + method, ...args);

    let resolveAfterMount; // resolves with unmount function
    const promise = new Promise(resolve => {
        resolveAfterMount = val => resolve(val)
    });

    let id; // element id
    let setState;

    const dispatch = function(action) {
        // TODO: NOTE: if there are keys which have data that can be transferred, it should be be in __XFER key in the object returned by the action declared in the files in ./flows/* ---- i might have to do a test in Comm sendMessage to test if the data in key marked for possible transferrable, is actually transferrable MAYBE im not sure, the browser might handle it, but if data is duplicated i should do the check
        callInRedux('dispatch', action);
    };

    // const unmountProxiedElement = function(dontUnmount, dontDispatch) {
    //     console.log('DOING unmountProxiedElement');
    //     if (!dontDispatch) dispatch(removeElement(id, dontUnmount));
    // };

    const progressor = function(aArg) {
        const { __PROGRESS } = aArg;

        if (__PROGRESS) {
            const { state } = aArg;
            if (id === undefined) {
                id = aArg.id;
                const setSetState = aSetState => {
                    setState = aSetState;
                    setState(() => state);
                };
                render(<Proxy Component={component} id={id} setSetState={setSetState} dispatch={dispatch} />, container);
                resolveAfterMount(dontUnmount => dispatch(removeElement(id, dontUnmount))); // link7884721
            } else {
                setState(() => state);
            }
        } else {
            // unmounted - server was shutdown by unregister()
            console.log('ok unmounting in dom, aArg:', aArg);
            if (!aArg || !aArg.dontUnmount) unmountComponentAtNode(container);
        }
    };

    callInRedux('addElement', { wanted }, progressor);

    // window is defintiely available, as renderProxiedElement is only used in DOM
    window.addEventListener('unload', ()=>dispatch(removeElement(id, true)), false);

    return promise;
}

class Server {
    // store = undefined
    // serverElement
    nextelementid = 0
    removeElement = {} // holds promises, to trigger to remove element
    constructor(reducers, serverElement) {

        // this.store = createStore(reducer, undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
        // this.store = createStore(combineReducers(reducers), undefined, compose(applyMiddleware(thunk), offline(offlineConfigDefault)));
        // this.store = createStore(combineReducers(reducers), undefined, applyMiddleware(thunk));
        this.store = createStore(combineReducers({ ...reducers, elements }));

        this.store.subscribe(this.render);
        this.serverElement = serverElement;
        this.render();
    }
    render = () => {
        console.log('IN SERVER RENDER');
        const state = this.store.getState();
        const { elements } = state;

        // check if any element was removed, if so then trigger this.removeElement which will resolve its hanging promise
        for (const id of Object.keys(this.removeElement)) {
            if (!(id in elements)) {
                this.removeElement(id);
            }
        }

        // TODO: shallowEqual here to figure out if i should update anything
        for (const { /*id,*/ wanted, setState } of elements) {
            setState(buildWantedState(wanted, state));
        }
        this.serverElement(state, this.store.dispatch); // equilavent of serverElement.setState(state)
    }
    addElement = (aArg, aReportProgress/*, ...args*/) => {
        // console.log('in addElement, aArg:', aArg, 'aReportProgress:', aReportProgress, 'args:', args);
        console.log('in addElement, aArg:', aArg);
        const id = (this.nextelementid++).toString(); // toString because it is used as a key in react - crossfile-link3138470
        return new Promise( resolve => { // i need to return promise, because if it is Comm, a promise will keep it alive so it keeps responding to aReportProgress
            const { wanted } = aArg;
            const setState = state => aReportProgress({ id, state });
            this.store.dispatch(addElement(id, wanted, setState));

            // this.removeElement[id] is only to be called by render as a result of dispatch(removeElement)
            this.removeElement[id] = () => {
                delete this.removeElement[id];
                resolve({ destroyed:true });
            };
        });
    }
    dispatch(aArg) {
        const action = aArg;
        this.store.dispatch(action);
    }
}

const DOTPATH_AS_PATT = /(.+) as (.+)$/m;
function buildWantedState(wanted, state) {
    console.log('state:', state, 'wanted:', wanted);
    let wanted_state = {};
    for (let dotpath of wanted) {
        let name;
        if (DOTPATH_AS_PATT.test(dotpath)) {
            // ([, dotpath, name] = DOTPATH_AS_PATT.exec(dotpath));
            let matches = DOTPATH_AS_PATT.exec(dotpath);
            dotpath = matches[1];
            name = matches[2];
        } else {
            name = dotpath.split('.');
            name = name[name.length-1];
        }
        wanted_state[name] = deepAccessUsingString(state, dotpath, 'THROW');
    }
    return wanted_state;
}

export { Server, renderProxiedElement }