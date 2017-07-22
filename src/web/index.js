import React, { Component } from 'react'
import { render } from 'react-dom'

import './theme-a.default.css'
import './index.css'

console.error('ENTER');

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
                {theme && <link href={theme+'.css'} rel="stylesheet" /> }
                {arr}
                <button onClick={this.useThemeB}>Use Theme B</button>
                <button onClick={this.useThemeDefault}>Use Theme Defeault</button>
            </div>
        );
    }
}

render(<App/>, document.getElementById('root'))
