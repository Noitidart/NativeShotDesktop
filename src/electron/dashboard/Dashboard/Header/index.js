// @flow

import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import Nav from './Nav'

import './index.css'

class Header extends PureComponent<void, void, void> {
    render() {
        return (
            <div className="App-header">
                <img src="../icons/icon.svg" className="App-logo" alt="logo" />
                <h2>NativeShot</h2>
                <Nav />
            </div>
        )
    }
}

export default withRouter(Header)