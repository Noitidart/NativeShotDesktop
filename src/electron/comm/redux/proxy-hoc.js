import React, { Component } from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'

import { removeElement } from './elements'

function proxyHOCFactory(callInReduxScope, serverName, wanted) {

    const callInRedux = (method, ...args) => callInReduxScope(serverName + '.' + method, ...args);
    const dispatchProxied = action => callInRedux('dispatch', action); // TODO: NOTE: if there are keys which have data that can be transferred, it should be be in __XFER key in the object returned by the action declared in the files in ./flow-control/* ---- i might have to do a test in Comm sendMessage to test if the data in key marked for possible transferrable, is actually transferrable MAYBE im not sure, the browser might handle it, but if data is duplicated i should do the check

    return function proxyHOC(WrappedComponent) {
        return (
            class ProxyConnect extends Component {
                static displayName = wrapDisplayName(WrappedComponent, 'ProxyConnect')
                state = {
                    id: undefined,
                    wanted: wanted.reduce( (acc, el) => acc[el] = undefined, {} )
                }
                constructor() {
                    super();
                    this.proxy();
                }
                componentWillUnmount() {
                    this.unproxy();
                }
                render () {
                    const { id, ...wantedState } = this.state;

                    // test if id is undefined because on mount, state has not yet been received, so dont render
                    return id === undefined ? null : <WrappedComponent {...this.props} dispatchProxied={dispatchProxied} {...wantedState} />;
                }

                proxy = () => {
                    callInRedux('addElement', { wanted }, this.progressor);
                    window.addEventListener('unload', this.unproxy);
                }
                unproxy = () => {
                    const { id } = this.state;
                    window.removeEventListener('unload', this.unproxy);
                    dispatchProxied(removeElement(id, true));
                }
                progressor = aArg => {
                    const { __PROGRESS } = aArg;

                    if (__PROGRESS) {
                        const { id, wantedState } = aArg;
                        // console.log('progressor, got wantedState:', wantedState);
                        this.setState( ({ id:idOld }) => idOld === undefined ? { id, ...wantedState } : wantedState); // i dont have setState with id everytime, id is only needed for initial setState
                    }
                    else { console.log('ok unproxied in dom, aArg:', aArg); } // unproxied - server was shutdown by unregister()
                }
            }
        )
    }
}

export default proxyHOCFactory