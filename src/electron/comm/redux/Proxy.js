import React, { Component } from 'react'

// Proxy is only rendered in html DOM so window exists for sure

export default class Proxy extends Component {
    // static propTypes = {
    //     Component: React.Component,
    //     id: PropTypes.string,
    //     setSetState: PropTypes.func.isRequired,
    //     dispatch: PropTypes.func.isRequired
    // }
    mounted = false
    initialState = {}
    componentDidMount() {
        this.mounted = true;
        const { setSetState } = this.props;
        setSetState(this.setState.bind(this));
    }
    render() {
        const { Component, dispatch } = this.props;
        const state = this.state;
        if (!this.mounted) {
            // because on mount, state has not yet been received, so dont render
            return null;
        } else {
            return <Component {...state} dispatch={dispatch} />
        }
    }
}