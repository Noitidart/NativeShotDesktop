import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'

import { up, upAsync, dn } from '../../flows/counter'

import Header from './Header'
import Pages from './Pages'

import './theme-default.css'
import './index.css'

import type { Shape as CounterShape } from '../../flows/counter'

type Props = {
    counter: CounterShape,
    dispatch: *
}

class Dashboard extends Component<void, Props, void> {
    handleUp = () => this.props.dispatch(up());
    handleUpAsync = () => this.props.dispatch(upAsync(6));
    handleDn = () => this.props.dispatch(dn());
    render() {
        const { counter } = this.props;

        const arr = [<span>1</span>, <span>2</span>, <span>3</span>];
        return (
            <HashRouter>
                <div className="App">
                    <Header />
                    <p className="App-intro">
                        Gotta <code>catch'em</code> all!!
                    </p>
                    <div>
                        <div>
                            Count: {counter}
                        </div>
                        <button onClick={this.handleUp}>Up</button>
                        <button onClick={this.handleUpAsync}>Up Async</button>
                        <button onClick={this.handleDn}>Dn</button>
                    </div>
                    <Pages />
                </div>
            </HashRouter>
        )
    }
}

export default Dashboard