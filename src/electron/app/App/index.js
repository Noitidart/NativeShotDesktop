import React, { Component } from 'react'

import { up, upAsync, dn } from '../../flows/counter'

import type { Shape as CounterShape } from '../../flows/counter'

type Props = {
    counter: CounterShape,
    dispatch: *
}

type State = {
    theme?: string
}

class App extends Component<void, Props, State> {
    state = {
        theme: undefined
    }
    useThemeB = () => this.setState(()=>({ theme:'./theme-b' }));
    useThemeDefault = () => this.setState(()=>({ theme:undefined }));
    handleUp = () => this.props.dispatch(up());
    handleUpAsync = () => this.props.dispatch(upAsync(6));
    handleDn = () => this.props.dispatch(dn());
    render() {
        const { counter } = this.props;
        const { theme } = this.state;

        const arr = [<span>1</span>, <span>2</span>, <span>3</span>];
        return (
            <div>
                {theme && <link href={theme+'.css2'} rel="stylesheet" /> }
                {arr}
                <button onClick={this.useThemeB}>Use Theme B</button>
                <button onClick={this.useThemeDefault}>Use Theme Defeault</button>
                <div>
                    Count: {counter}
                </div>
                <button onClick={this.handleUp}>Up</button>
                <button onClick={this.handleUpAsync}>Up Async</button>
                <button onClick={this.handleDn}>Dn</button>
            </div>
        )
    }
}

export default App