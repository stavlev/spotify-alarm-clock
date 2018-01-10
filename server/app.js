'use strict';

/** Module dependencies. */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes');

const port = process.env.PORT || 8888;

// configure the express server
const app = express();

/*// if we're developing, use webpack middleware for module hot reloading
if (process.env.NODE_ENV !== 'production') {
    console.log('==> 🌎 using webpack');

    // load and configure webpack
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack/dev.config');

    // setup middleware
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
    app.use(webpackHotMiddleware(compiler));
}*/

app.set('port', port);
app.use(logger('dev'))
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(express.static(path.resolve(__dirname, '../public')))
    .use('/', routes);

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
