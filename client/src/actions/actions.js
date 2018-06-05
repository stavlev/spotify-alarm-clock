import Spotify from 'spotify-web-api-js';
import * as ActionTypes from './actionTypes';

const spotifyApi = new Spotify();
const shuffle = require('shuffle-array');

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

export const getMySavedTracks = () => {
    let tracks = [];
    return dispatch => {
        dispatch({type: ActionTypes.SPOTIFY_FAVORITE_TRACKS_REQUESTED});

        spotifyApi.getMySavedTracks({limit: 50})
            .then(data => {
                tracks = tracks.concat(data.items);
                if (data.next) {
                    return spotifyApi.getGeneric(data.next);
                }
                return data;
            })
            .then(data => {
                if (data.next) {
                    tracks = tracks.concat(data.items);
                    return spotifyApi.getGeneric(data.next);
                }
                return data;
            })
            .then(data => {
                if (data.next) {
                    tracks = tracks.concat(data.items);
                    return spotifyApi.getGeneric(data.next);
                }
                return data;
            })
            .then(data => {
                if (data) {
                    tracks = tracks.concat(data.items);
                }
                return tracks.filter(t => t.track.preview_url !== null).map(t => t.track.id);
            })
            .then(tracksIds => spotifyApi.getAudioFeaturesForTracks(tracksIds))
            .then(tracks => {
                console.log(tracks.audio_features);
                dispatch({type: ActionTypes.SPOTIFY_FAVORITE_TRACKS_SUCCESS, tracks: tracks.audio_features});
            }).catch(error => {
            dispatch({type: ActionTypes.SPOTIFY_FAVORITE_TRACKS_FAILURE, error: error});
        });
    };
};

export const chooseTrack = (tracks, didUserSleepWellInput) => {
    var tracksFeatures = shuffle(tracks, {'copy': true});
    return dispatch => {
        dispatch({type: ActionTypes.CHOOSE_TRACK_REQUESTED});

        var isMatchingTrackFound = false;
        var matchingTrack = tracksFeatures[0];

        var i;
        for (i = 0; i < tracksFeatures.length && !isMatchingTrackFound; i++) {
            var currTrackFeatures = tracksFeatures[i];

            var minPossibleDanceability = didUserSleepWellInput ? 0.83 : 0.54;  // 0.83 = 363/437, 0.54 = 237/437
            var minPossibleEnergy = didUserSleepWellInput ? 0.125 : 0.17;       // 0.125 = 55/437, 0.17 = 74/437
            var minPossibleLoudness = (((didUserSleepWellInput ? 0.41 : 0.22) * 60.0) - 60.0);  // 0.41 = 177/437, 0.22 = 97/437
            var minPossibleValence = didUserSleepWellInput ? 0.95 : 0.82;       // 0.95 = 417/437, 0.82 = 360/437

            var isTrackMatching =
                currTrackFeatures.danceability >= minPossibleDanceability &&
                currTrackFeatures.energy >= minPossibleEnergy &&
                currTrackFeatures.loudness >= minPossibleLoudness &&
                currTrackFeatures.valence >= minPossibleValence;

            if (isTrackMatching) {
                matchingTrack = currTrackFeatures;
                isMatchingTrackFound = true;
            }
        }

        spotifyApi.getTrack(matchingTrack.id)
            .then(chosenTrack => dispatch({
                type: ActionTypes.CHOOSE_TRACK_SUCCESS, chosenTrack: chosenTrack.preview_url,
            }))
            .catch(error => {
                dispatch({type: ActionTypes.CHOOSE_TRACK_FAILURE, error: error});
            });
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

export const handleUserSleepQualityInput = (tracks, didUserSleepWellInput) => {
    chooseTrack(tracks, didUserSleepWellInput);
    return {type: ActionTypes.HANDLE_USER_SLEEP_QUALITY_INPUT, didUserSleepWell: didUserSleepWellInput};
};

/** set the app's access and refresh tokens */
export const setTokens = ({accessToken, refreshToken}) => {
    if (accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }
    return {type: ActionTypes.SPOTIFY_SET_TOKENS, accessToken, refreshToken};
};

/** get the user's info from the /me api */
export const getMyInfo = () => {
    return dispatch => {
        dispatch({type: ActionTypes.SPOTIFY_USER_REQUESTED});
        spotifyApi.getMe().then(data => {
            dispatch({type: ActionTypes.SPOTIFY_USER_SUCCESS, data: data});
        }).catch(e => {
            dispatch({type: ActionTypes.SPOTIFY_USER_FAILURE, error: e});
        });
    };
};

function randomProbability() {
    var randomProbability = randomInRange(0, 1);
    return randomProbability;
}

function randomInRange(min, max) {
    var randomDouble = Math.random() * (max - min) + min;
    return randomDouble;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}