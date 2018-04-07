import * as ActionTypes  from '../actions/actionTypes';
import { filter, any } from 'ramda';
import moment from 'moment';
import uuidV4 from 'uuid/v4';
import Sound from 'react-sound';

const initialState = {
    accessToken: null,
    refreshToken: null,
    alarms: [],
    sleepQualityInfo: {
        pLastSleepCycleInterrupted: 0,
        pAverageHeartRateAbnormal: 0,
        pAverageOxygenLevelAbnormal: 0
    },
    newAlarm: {
        id: uuidV4(),
        dateTime: moment(),
        message: "",
        isActive: true
    },
    user: {
        loading: false,
        country: null,
        display_name: null,
        email: null,
        external_urls: {},
        followers: {},
        href: null,
        id: null,
        images: [],
        product: null,
        type: null,
        uri: null,
    },
    tracks: [],
    chosenTrack: null,
    open: false,
    playStatus: Sound.status.STOPPED,
    alarm: {
        id: uuidV4(),
        dateTime: moment(),
        message: "",
        isActive: true
    }
};

export default function alarmReducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.SPOTIFY_SET_TOKENS:
            const {accessToken, refreshToken} = action;
            return Object.assign({}, state, {accessToken, refreshToken});

        case ActionTypes.SPOTIFY_USER_REQUESTED:
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, {loading: true})
            });

        case ActionTypes.SPOTIFY_USER_SUCCESS:
            return Object.assign({}, state, {
                user: Object.assign({}, state.user, action.data, {loading: false})
            });

        case ActionTypes.CHOOSE_TRACK_REQUESTED:
            return Object.assign({}, state, {
                choseTracks: Object.assign({}, state.chosenTrack)
            });

        case ActionTypes.CHOOSE_TRACK_SUCCESS:
            return Object.assign({}, state, {
                tracks: Object.assign({}, state.chosenTrack, action.data)
            });

        case ActionTypes.GET_SLEEP_QUALITY_INFO:
            return {
                ...state,
                sleepQualityInfo: {
                    pLastSleepCycleInterrupted: randomProbability(),
                    pAverageHeartRateAbnormal: randomProbability(),
                    pAverageOxygenLevelAbnormal: randomProbability()
                }
            };

        case ActionTypes.CHANGE_DATE_TIME:
            return {
                ...state,
                newAlarm: {
                    ...state.newAlarm,
                    dateTime: action.dateTime
                }
            };

        case ActionTypes.CHANGE_MESSAGE:
            return {
                ...state,
                newAlarm: {
                    ...state.newAlarm,
                    message: action.message
                }
            };

        case ActionTypes.SAVE_NEW_ALARM:
            return {
                ...state,
                alarms: [...state.alarms, action.newAlarm],
                newAlarm: {
                    id: uuidV4(),
                    dateTime: moment(),
                    message: "",
                    isActive: true
                }
            };

        case ActionTypes.REMOVE_OLD_ALARMS:
            return {
                ...state,
                alarms: filter(alarm => !any(rangAlarm => rangAlarm === alarm, action.rangAlarms), state.alarms)
            };

        case ActionTypes.HANDLE_OPEN:
            return {
                ...state,
                open: true,
                playStatus: Sound.status.PLAYING,
                alarm: action.alarm
            };

        case ActionTypes.HANDLE_CLOSE:
            return {
                ...state,
                open: false,
                playStatus: Sound.status.STOPPED,
                alarm: {
                    id: uuidV4(),
                    dateTime: moment(),
                    message: "",
                    isActive: true
                }
            };

        case ActionTypes.SPOTIFY_USER_FAILURE:
            return state;

        case ActionTypes.CHOOSE_TRACK_FAILURE:
            return state;

        default:
            return state;
    }
}

function randomProbability() {
    var randomProbability = randomInRange(0,1);
    return randomProbability;
}

function randomInRange(min, max) {
    var randomDouble = Math.random() * (max-min) + min;
    return randomDouble;
}