import React, { PureComponent } from 'react'

import { up, upAsync, dn } from '../../flows/counter'

import type { Shape as CounterShape } from '../../flows/counter'

type Props = {
    counter: CounterShape,
    dispatch: *
}

class Dashboard extends PureComponent<void, Props, void> {
    handleUp = () => this.props.dispatch(up());
    handleUpAsync = () => this.props.dispatch(upAsync(6));
    handleDn = () => this.props.dispatch(dn());
    render() {
        const { counter } = this.props;

        return (
            <div>
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

export default Dashboard