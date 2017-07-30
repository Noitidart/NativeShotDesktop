import React, { Component } from 'react'

import { State as CoreShape } from '../../flows/core'

type Props = {
    core: CoreShape,
    dispatch: * => *
}
class App extends Component<void, Props, void> {
    state = {
        theme: undefined
    }
    useThemeB = () => this.setState(()=>({ theme:'./theme-b' }));
    useThemeDefault = () => this.setState(()=>({ theme:undefined }));
    componentDidMount() {
        document.title = 'NativeShot | Dashboard'
    }
    render() {
        const { todos=[] } = this.props;
        const { theme } = this.state;

        const arr = [<span>1</span>, <span>2</span>, <span>3</span>];
        return (
            <div>
                {theme && <link href={theme+'.css2'} rel="stylesheet" /> }
                {arr}
                <button onClick={this.useThemeB}>Use Theme B</button>
                <button onClick={this.useThemeDefault}>Use Theme Defeault</button>
                <div>
                    {todos.map(todo =>
                        <div key={todo.id}>
                            {todo.txt}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default App