import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createBrowserHistory} from 'history';
import {Router, Route, IndexRoute, browserHistory, Switch} from 'react-router';
import {syncHistoryWithStore, routerMiddleware, routerReducer} from 'react-router-redux';
import './styles/index.css';
import reducer from './reducers';
import App from './App';
import Login from "./components/Login";
import Alarm from "./components/Alarm";

const store = createStore(combineReducers({
    alarm: reducer,
    routing: routerReducer
}), undefined, applyMiddleware(routerMiddleware(browserHistory), thunkMiddleware));
const history = syncHistoryWithStore(createBrowserHistory(), store);

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <App>
                        <Switch>
                            <IndexRoute exact path="/login" component={Login}/>
                            <Route path="/alarm/:accessToken/:refreshToken" component={Alarm}/>
                            <Route path="/error/:errorMsg" component={Error}/>
                        </Switch>
                    </App>
                </Router>
            </Provider>
        );
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));