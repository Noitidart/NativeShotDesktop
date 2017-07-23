import React, { Component } from 'react'
import { render } from 'react-dom'

import { Client as ElectronClient } from '../comm/electron-client'
import { callInTemplate } from '../comm/comm'

import { wait } from 'cmn/all'

import './theme-a.default.css'
import './index.css'

console.error('ENTER');

const gBgComm = new ElectronClient(exports, 'app', function() {
    console.log('client side handshake triggered');
});
const callInBackground = callInTemplate.bind(null, gBgComm, null, null); // eslint-disable-line no-unused-vars
// export const callIn = (...args) => new Promise(resolve => exports['callIn' + args.shift()](...args, val=>resolve(val))); // must pass undefined for aArg if one not provided, due to my use of spread here. had to do this in case first arg is aMessageManagerOrTabId
// export const promiseInBackground = (...args) => new Promise(resolve => callInBackground(...args, val=>resolve(val))); // must pass undefined for aArg if one not provided, due to my use of spread here. had to do this in case first arg is aMessageManagerOrTabId


class App extends Component {
    state = {
        theme: undefined
    }
    useThemeB = () => this.setState(()=>({theme:'./theme-b'}));
    useThemeDefault = () => this.setState(()=>({theme:undefined}));
    render() {
        let { theme } = this.state;
        let arr = [<span>1</span>, <span>2</span>, <span>3</span>];
        return (
            <div>
                {theme && <link href={theme+'.css2'} rel="stylesheet" /> }
                {arr}
                <button onClick={this.useThemeB}>Use Theme B</button>
                <button onClick={this.useThemeDefault}>Use Theme Defeault</button>
            </div>
        );
    }
}

// // test to call into main, and not get a return value
// callInBackground('testNoReturn', 1);

// test to call into main, and get a return value
callInBackground('testReturn', 1, function(arg) {
    console.log('back in app, arg:', arg);
});

// // test to call into main, and get callbacks, then fianlly return value
// callInBackground('testReportProgress', undefined, function(arg) {
//     console.log('back in app, arg:', arg);
// });


// these three are setup to testing app calling into main
export function testNoReturn2(arg) {
    console.log('in testNoReturn2, arg:', arg);
}

export function testReturn2(arg) {
    console.log('in testReturn2! arg:', arg);
    return 'test';
}

export async function testReportProgress2(arg, reportProgress) {
    console.log('in testReportProgress2');
    reportProgress({ step:1 });
    reportProgress({ step:2 });
    await wait(1000);
    return { step:'done' };
}

render(<App/>, document.getElementById('root'))
