'use strict';

/** Module dependencies. */
var express = require('express');
var cookieParser = require('cookie-parser');
const routes = require('./routes');
const path = require('path');

const port = 8888;

// configure the express server
var app = express();
app.use(express.static(path.resolve(__dirname, '../public')))
    .use(cookieParser())
    .use('/', routes);

app.listen(port, () => {
    console.log('Express server listening on port ' + port);
});
