import React, { Component } from 'react'

class App extends Component {
    // static propTypes = {
    //     core: PropTypes.object,
    //     todos: PropTypes.array,
    //     dispatch: PropTypes.func.isRequired
    // }
    state = {
        theme: undefined
    }
    useThemeB = () => this.setState(()=>({theme:'./theme-b'}));
    useThemeDefault = () => this.setState(()=>({theme:undefined}));
    render() {
        let { todos /*, dispatch*/ } = this.props;
        let { theme } = this.state;

        let arr = [<span>1</span>, <span>2</span>, <span>3</span>];
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