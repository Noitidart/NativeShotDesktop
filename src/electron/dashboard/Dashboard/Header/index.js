// @flow

import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import Nav from './Nav'

import LOGO from '../../../icons/icon.svg'
import './index.css'

class Header extends PureComponent<void, void, void> {
    render() {
        return (
            <div className="App-header">
                <img src={LOGO} className="App-logo" alt="logo" />
                <h2>NativeShot</h2>
                <Nav />
            </div>
        )
    }
}

export default withRouter(Header)