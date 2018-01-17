import React, { Component } from 'react';

export default class Login extends Component {
    render() {
        // injected via react-router
        const { errorMsg } = this.props.params;
        return (
            <div className="error">
                <h2>An Error has occurred</h2>
                <p>{errorMsg}</p>
            </div>
        );
    }
}
