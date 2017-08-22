import React, { PureComponent } from 'react'
import { HashRouter } from 'react-router-dom'

import Header from './Header'
import Pages from './Pages'
import Counter from './Counter'

import './theme-default.css'
import './index.css'

class Dashboard extends PureComponent<void, void, void> {
    render() {
        const arr = [<span>1</span>, <span>2</span>, <span>3</span>];
        return (
            <HashRouter>
                <div className="App">
                    <Header />
                    <p className="App-intro">
                        Gotta <code>catch'em</code> all!!
                    </p>
                    <Counter />
                    <Pages />
                </div>
            </HashRouter>
        )
    }
}

export default Dashboard