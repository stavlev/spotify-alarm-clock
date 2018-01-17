import Spotify from 'spotify-web-api-js';

const spotifyApi = new Spotify();

export const SPOTIFY_SET_TOKENS = 'SPOTIFY_SET_TOKENS';
export const SPOTIFY_USER_REQUESTED = 'SPOTIFY_USER_REQUESTED';
export const SPOTIFY_USER_SUCCESS = 'SPOTIFY_USER_SUCCESS';
export const SPOTIFY_USER_FAILURE = 'SPOTIFY_USER_FAILURE';

/** set the app's access and refresh tokens */
export function setTokens({accessToken, refreshToken}) {
    if (accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }
    return { type: SPOTIFY_SET_TOKENS, accessToken, refreshToken };
}

/* get the user's info from the /me api */
export function getMyInfo() {
    return dispatch => {
        dispatch({ type: SPOTIFY_USER_REQUESTED});
        spotifyApi.getMe().then(data => {
            dispatch({ type: SPOTIFY_USER_SUCCESS, data: data });
        }).catch(e => {
            dispatch({ type: SPOTIFY_USER_FAILURE, error: e });
        });
    };
}
