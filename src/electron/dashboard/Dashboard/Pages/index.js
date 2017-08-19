import React, { PureComponent } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import { ENDPOINTS } from '../../'

import GalleryPage from './GalleryPage'
import SettingsPage from './SettingsPage'
import AuthPage from './AuthPage'

const PAGES = [
    { path:'/',         label:'Gallery',        Body:GalleryPage  },
    { path:'/settings', label:'Settings',       Body:SettingsPage },
    { path:'/auth',     label:'Authentication', Body:AuthPage     }
]

type Props = {

}

class PagesDumb extends PureComponent<void, Props, void> {
    componentDidMount() {
        console.log('Pages mounted, this.props:', this.props);
        ENDPOINTS.loadSettings = () =>this.props.history.push('settings');
    }
    render() {
        return (
            <div>
                <Switch>
                    { PAGES.map( ({ Body, path }) => <Route path={path} key={path} exact component={Body} /> ) }
                </Switch>
            </div>
        )
    }
}

const Pages = withRouter(PagesDumb)

export { PAGES }
export default Pages