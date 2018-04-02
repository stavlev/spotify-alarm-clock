import Spotify from 'spotify-web-api-js';
import * as ActionTypes from './actionTypes';

const spotifyApi = new Spotify();

export const changeDateTime = (newDateTime) => {
    return {
        type: ActionTypes.CHANGE_DATE_TIME,
        dateTime: newDateTime
    };
};

export const changeMessage = (newMessage) => {
    return {
        type: ActionTypes.CHANGE_MESSAGE,
        message: newMessage
    };
};

export const saveNewAlarm = (newAlarm) => {
    return {
        type: ActionTypes.SAVE_NEW_ALARM,
        newAlarm: newAlarm
    };
};

export const removeOldAlarms = (rangAlarms) => {
    return {
        type: ActionTypes.REMOVE_OLD_ALARMS,
        rangAlarms: rangAlarms
    };
};

export const handleOpen = (alarm) => {
    return {
        type: ActionTypes.HANDLE_OPEN,
        alarm: alarm
    };
};

export const handleClose = () => {
    return {
        type: ActionTypes.HANDLE_CLOSE
    };
};

/** set the app's access and refresh tokens */
export const setTokens = ({accessToken, refreshToken}) => {
    if (accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }
    return { type: ActionTypes.SPOTIFY_SET_TOKENS, accessToken, refreshToken };
};

/* get the user's info from the /me api */
export const getMyInfo = () => {
    return dispatch => {
        dispatch({ type: ActionTypes.SPOTIFY_USER_REQUESTED});
        spotifyApi.getMe().then(data => {
            dispatch({ type: ActionTypes.SPOTIFY_USER_SUCCESS, data: data });
        }).catch(e => {
            dispatch({ type: ActionTypes.SPOTIFY_USER_FAILURE, error: e });
        });
    };
};

export const getMySavedTracks = () => {
    return dispatch => {
        dispatch({ type: ActionTypes.SPOTIFY_FAVORITE_TRACKS_REQUESTED});
        spotifyApi.getMySavedTracks({limit: 50})
            .then(data => data.items.map(t => t.track.id))
            .then(trackIds => spotifyApi.getAudioFeaturesForTracks(trackIds))
            .then(tracks => {
                dispatch({type: ActionTypes.SPOTIFY_FAVORITE_TRACKS_SUCCESS, data: tracks.audio_features});
            }).catch(error => {
                dispatch({ type: ActionTypes.SPOTIFY_FAVORITE_TRACKS_FAILURE, error: error });
        });
    };
};