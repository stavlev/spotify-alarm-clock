import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {syncHistory, routerMiddleware, routerReducer} from 'react-router-redux';
import './styles/index.css';
import alarmReducer from './reducers';
import App from './App';
import Login from "./components/Login";
import Alarm from "./components/Alarm";

const reduxRouterMiddleware = syncHistory(hashHistory);
const createStoreWithMiddleware = applyMiddleware(
    thunk,
    reduxRouterMiddleware
)(createStore);
const store = createStoreWithMiddleware(alarmReducer);

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={hashHistory}>
                    <Route path="/" component={App}>
                        <IndexRoute component={Login} />
                        <Route path="/alarm/:accessToken/:refreshToken" component={Alarm}/>
                        <Route path="/error/:errorMsg" component={Error}/>
                    </Route>
                </Router>
            </Provider>
        );
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));