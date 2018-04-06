import Spotify from 'spotify-web-api-js';
import * as ActionTypes from './actionTypes';

const spotifyApi = new Spotify();

export const getUserSleepQualityInfo = () => {
    return {
        type: ActionTypes.GET_SLEEP_QUALITY_INFO
    };
};

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

export const chooseTrack = () => {
    return dispatch => {
        dispatch({ type: ActionTypes.CHOOSE_TRACK_REQUESTED});
``
        var userSleepQualityInfo = getUserSleepQualityInfo();

        // Calculate a number between 0.0-1.0 indicating the probability of how well the user slept
        var expectedUserTiredness = (
            userSleepQualityInfo.pLastSleepCycleInterrupted +
            userSleepQualityInfo.pAverageHeartRateAbnormal +
            userSleepQualityInfo.pAverageOxygenLevelAbnormal) / 3.0;

        spotifyApi.getMySavedTracks({limit: 500})
            .then(data => data.items.map(t => t.track.id))
            .then(trackIds => spotifyApi.getAudioFeaturesForTracks(trackIds))
            .then(tracks => {
                // TODO: Iterate through the tracks and find the first one matching the userSleepQuality
                var isMatchingTrackFound = false;
                var matchingTrack;

                var i;
                for (i = 0; i < tracks.audio_features.length && !isMatchingTrackFound; i++) {
                    var currTrackFeatures = tracks.audio_features[i];

                    var minPossibleDanceability = expectedUserTiredness;
                    var minPossibleEnergy = expectedUserTiredness;
                    var minPossibleLoudness = ((expectedUserTiredness * 60.0) - 60.0);

                    var isTrackMatching =
                        currTrackFeatures.danceability >= minPossibleDanceability &&
                        currTrackFeatures.energy >= minPossibleEnergy &&
                        currTrackFeatures.loudness >= minPossibleLoudness;

                    if (isTrackMatching) {
                        matchingTrack = tracks[i];
                        isMatchingTrackFound = true;
                    }
                }

                dispatch({type: ActionTypes.CHOOSE_TRACK_SUCCESS, data: matchingTrack});
            }).catch(error => {
            dispatch({ type: ActionTypes.CHOOSE_TRACK_FAILURE, error: error });
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

/** set the app's access and refresh tokens */
export const setTokens = ({accessToken, refreshToken}) => {
    if (accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }
    return { type: ActionTypes.SPOTIFY_SET_TOKENS, accessToken, refreshToken };
};

/** get the user's info from the /me api */
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