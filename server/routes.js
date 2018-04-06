'use strict';

const querystring = require('querystring');
const express = require('express'); // Express web server framework
const router = new express.Router();
var request = require('request'); // "Request" library

// configure the express server
const CLIENT_ID = '7d8a512541254211bc6207a8e083e61f';
const CLIENT_SECRET = 'bd85912da96043899085baf2433c8488';
const REDIRECT_URI = 'http://localhost:8888/callback';
const STATE_KEY = 'spotify_auth_state';

const scope = 'user-read-private user-read-email user-library-read';

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);

router.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(STATE_KEY, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        }));
});

router.get('/callback', function (req, res) {
    // your application requests refresh and access tokens after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[STATE_KEY] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#/error/state mismatch');
    }
    else {
        res.clearCookie(STATE_KEY);
        var authRequestParams = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        };

        request.post(authRequestParams, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var userRequestParams = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {'Authorization': 'Bearer ' + access_token},
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(userRequestParams, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        // we can also pass the token to the browser to make requests from there
                        res.redirect(`/#/alarm/${access_token}/${refresh_token}`);
                    }
                    else {
                        res.redirect('/#/error/invalid token');
                    }
                });
            }
            else {
                res.redirect('/#/error/invalid token');
            }
        });
    }
});

module.exports = router;