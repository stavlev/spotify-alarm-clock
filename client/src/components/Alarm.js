import React, {Component} from 'react';
import { connect } from 'react-redux';
import {map, addIndex, forEach} from 'ramda';
import {Paper, RaisedButton, Subheader, TextField, List, ListItem} from 'material-ui';
import DeviceAccessAlarm from 'material-ui/svg-icons/device/access-alarm';
import ActionAlarmAdd from 'material-ui/svg-icons/action/alarm-add';
import Toggle from 'material-ui/Toggle';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import DateTimePicker from 'material-ui-datetimepicker';
import Clock from 'react-live-clock';
import RingDialog from './RingDialog';
import {getMyInfo,
        setTokens,
        changeDateTime,
        changeMessage,
        saveNewAlarm,
        removeOldAlarms,
} from "../actions/actions";

export class Alarm extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {dispatch, params} = this.props;
        const {accessToken, refreshToken} = params;

        dispatch(setTokens({accessToken, refreshToken}));
        dispatch(getMyInfo());
    }

    checkIfAlarm = (openDialog) => {
        const {dispatch, alarms} = this.props;
        const rangAlarms = [];

        forEach(alarm => {
            if (alarm.dateTime.isSame(new Date(), 'minute') && alarm.isActive) {
                dispatch(openDialog({...alarm}));
                rangAlarms.push(alarm);
            }
        }, alarms);

        dispatch(removeOldAlarms(rangAlarms));
    };

    checkIfAlarmRingsSoon = (chooseTrack) => {
        const {dispatch, alarms} = this.props;

        forEach(alarm => {
            var diffMs = (alarm.datetime - (new Date()));                       // milliseconds between now & the alarm time
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // diff in minutes

            var isAlarmAboutToRingInAMinute = diffMins == 1;

            if (isAlarmAboutToRingInAMinute) {
                dispatch(chooseTrack());
            }
        }, alarms);
    };

    render() {
        const {dispatch, user, newAlarm, alarms} = this.props;

        return (
            <div>
                <h1>Alarm Clock</h1>
                <h2>{`Logged in as ${user.id}`}</h2>
                <div className="current-time-container">
                    <Subheader className="sub-header">Current Time: </Subheader>
                    <Clock className="current-time" format={'HH:mm:ss'} ticking={true}/>
                    <Clock className="date" format={'dddd, MMMM Mo, YYYY'} ticking={true}/>
                </div>
                <div className="set-alarm-container">
                    <Subheader className="sub-header">Set Alarm: </Subheader>
                    <DateTimePicker
                        className="date-picker"
                        returnMomentDate={true}
                        DatePicker={DatePickerDialog}
                        TimePicker={TimePickerDialog}
                        floatingLabelText="Set alarm date"
                        minDate={new Date()}
                        value={newAlarm.dateTime}
                        onChange={v => dispatch(changeDateTime(v))}
                    />
                    <TextField className="message" floatingLabelText="Add Message" value={newAlarm.message}
                               onChange={(ev, v) => dispatch(changeMessage(v))} floatingLabelFixed={true}/>
                    <br/>
                    <RaisedButton className="save" label="Save Alarm" primary={true}
                                  onClick={() => dispatch(saveNewAlarm(newAlarm))} icon={<ActionAlarmAdd/>}/>
                </div>
                <Subheader className="sub-header">Alarms:</Subheader>
                <Paper className="alarms-paper" zDepth={2}>
                    <List>
                        <div className="alarms-list">
                            {
                                addIndex(map)((alarm, i) => {
                                    return (
                                        <div className="alarm-container" key={i}>
                                            <ListItem
                                                key={i}
                                                primaryText={alarm.dateTime.format("HH:mm DD-MM-YYYY")}
                                                secondaryText={alarm.message}
                                                leftIcon={<DeviceAccessAlarm/>}
                                                rightToggle={<Toggle toggled={alarm.isActive}/>}
                                            />
                                        </div>
                                    )
                                }, alarms)
                            }
                        </div>
                    </List>
                </Paper>
                <RingDialog dispatch={dispatch}
                            checkIfAlarm={this.checkIfAlarm}
                            checkIfAlarmRingsSoon={this.checkIfAlarmRingsSoon}
                            open={this.props.open}
                            alarm={this.props.alarm}
                            playStatus={this.props.playStatus} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        newAlarm: state.newAlarm,
        alarms: state.alarms,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        open: state.open,
        alarm: state.alarm,
        playStatus: state.playStatus
    }
}

export default connect(mapStateToProps)(Alarm);