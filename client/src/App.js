import React, {Component} from 'react';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

export default class App extends Component {
    render() {
        // injected via react router
        const {children} = this.props;
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div className="app">
                    {children}
                </div>
            </MuiThemeProvider>
        );
    }
}
