// TODO: is this todo on the right comment still valid? 082117 // TODO: figure out how to make redux-offline only persist some keys, like there is no reason to persist messages
import { combineReducers, createStore } from 'redux'
import { pick, arrayToObject } from 'cmn/lib/all'
import {  depth0Or1Equal } from 'cmn/lib/recompose'


import { addElement } from './elements'

class Server {
    // store = undefined
    // serverElement
    // stateOld = undefined
    nextelementid = 0
    removeElement = {} // holds promises, to trigger to remove element
    constructor(store, serverElement) {
        // server side wantedState
        store.subscribe(this.render);
        this.store = store;
        this.serverElement = serverElement;
        this.serverElementDidNotMount = true;
        this.render();
    }
    render = () => {
        // console.log('IN SERVER RENDER');
        const state = this.store.getState();
        const { stateOld={} } = this;
        this.stateOld = state;

        const { elements } = state;
        const { elements:elementsOld } = stateOld;

        const changed = {};
        for (const key of Object.keys(state)) {
            console.log(`comparing if "${key}" changed in state, now:`, state[key], 'old:', stateOld[key]);
            // if (!shallowEqualDepth(state[key], stateOld[key])) changed[key] = true;
            if (!depth0Or1Equal(state[key], stateOld[key])) changed[key] = true; // as in server side, i can do reference checking, as i am careful in the reducers to return the same state if no change is needed
            // console.log(key in changed ? 'yes it changed!' : 'no it didnt change', 'state:', state[key], 'stateOld:', stateOld[key]);
        }

        if (didWantedChange(['elements'], changed)) {
            const elementIds = arrayToObject(elements, 'id');
            console.log('removeElement:', this.removeElement, 'ids:', elementIds);
            for (const id of Object.keys(this.removeElement)) {
                if (!elementIds[id]) {
                    // this id was removed, so lets trigger the this.removeElement[id] of it
                    console.log('id:', id, 'this id was removed, so lets trigger the this.removeElement[id] of it');
                    // TODO: because removeElement is not set until promise returns, AND if remove is called before that promise returns (which i dont think would ever happen BUT still it might depending on if a proxiedMount proxiedUnmount was called, i dont know if its setup for this right now but its possible due to async tick nature).... its a promise, i should do a retry until removeElement comes into existance. the promsie is seen at link8917472
                    this.removeElement[id]();
                }
            }
            console.log('done iter');
        }

        for (const { id, wanted, setState } of elements) {

            const justAdded = !elementsOld.find( element => element.id === id );
            if (justAdded) {
                // do setState, this is needed for triggering the mount
                const wantedState = buildWantedState(wanted, state) || {}; // the || {} is only for when justAdded/serverElement just mounting
                setState(wantedState);
            } else if (didWantedChange(wanted, changed)) {
                const wantedState = buildWantedState(wanted, state);
                if (wantedState) setState(wantedState);
            }
        }

        {
            const wanted = this.serverElement.wantedState;
            // console.log('serverElement.wanted:', wanted);
            if (this.serverElementDidNotMount) {
                delete this.serverElementDidNotMount;
                const wantedState = buildWantedState(wanted, state) || {}; // the || {} is only for when justAdded/serverElement just mounting
                this.serverElement(wantedState, stateOld, this.store.dispatch); // equilavent of serverElement.setState(state)
            } else if (didWantedChange(wanted, changed)) {
                // console.log('will get wantedState and render background element maybe');
                const wantedState = buildWantedState(wanted, state);
                if (wantedState) this.serverElement(wantedState, stateOld, this.store.dispatch); // equilavent of serverElement.setState(state)
            }
            // else { console.log('will not render background element as no change'); }
        }
    }
    addElement = (aArg, aReportProgress/*, ...args*/) => {
        // console.log('in addElement, aArg:', aArg, 'aReportProgress:', aReportProgress, 'args:', args);
        // console.log('in addElement, aArg:', aArg);
        const id = (this.nextelementid++).toString(); // toString because it is used as a key in react - crossfile-link3138470
        return new Promise( resolve => { // i need to return promise, because if it is Comm, a promise will keep it alive so it keeps responding to aReportProgress
            const { wanted } = aArg;
            const setState = wantedState => aReportProgress({ id, wantedState }); // wantedState is object of keys of `wanted` with their values from app state container TODO: probably dont send id everytime, probably just on first one - extremely slight perf enhance
            this.store.dispatch(addElement(id, wanted, setState));

            // this.removeElement[id] is only to be called by render as a result of dispatch(removeElement)
            this.removeElement[id] = () => { // link8917472 - see this thing is inside of a promise
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

function didWantedChange(wanted, changeds) {
    if (!wanted) return false;
    for (const key of wanted) {
        if (key in changeds) {
            return true;
        }
    }
    return false;
}

function buildWantedState(wanted, state) {
    // goes through keys of wanted, makes sure it is a key in state, if it is then it picks it
    // console.log('wanted:', wanted);
    // console.log('state:', state, 'wanted:', wanted);
    const wantedState = {};
    if (!wanted) return null;
    let somethingWanted = false;
    for (const key of wanted) {
        if (key in state) {
            somethingWanted = true;
            wantedState[key] = state[key];
        }
    }
    if (!somethingWanted) return null;
    return wantedState;
}

export default Server