import React, {Component} from 'react';
import {
    map,
    addIndex,
    forEach,
    filter,
    any
} from 'ramda';
import {Paper, RaisedButton, Subheader, TextField, List, ListItem} from 'material-ui';
import DeviceAccessAlarm from 'material-ui/svg-icons/device/access-alarm';
import ActionAlarmAdd from 'material-ui/svg-icons/action/alarm-add';
import Toggle from 'material-ui/Toggle';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import DateTimePicker from 'material-ui-datetimepicker';
import moment from 'moment';
import Clock from 'react-live-clock';
import uuidV4 from 'uuid/v4';
import RingDialog from './RingDialog';
import {getMyInfo, setTokens} from "../actions/actions";

class Alarm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alarms: [],
            newAlarm: {
                id: uuidV4(),
                dateTime: moment(),
                message: "",
                isActive: true
            }
        };

        this.checkIfAlarm = this.checkIfAlarm.bind(this);
        this.handleDateTimeChange = this.handleDateTimeChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.saveNewAlarm = this.saveNewAlarm.bind(this);
    }

    componentDidMount() {
        const {dispatch, params} = this.props;
        const {accessToken, refreshToken} = params;
        dispatch(setTokens({accessToken, refreshToken}));
        dispatch(getMyInfo());
    }

    checkIfAlarm(openDialog) {
        console.log("alarm!");
        const rangAlarms = [];
        forEach(alarm => {
            if (alarm.dateTime.isSame(new Date(), 'minute') && alarm.isActive) {
                openDialog({...alarm});
                rangAlarms.push(alarm);
            }
        }, this.state.alarms);
        this.setState({
            alarms: filter(alarm => !any(rangAlarm => rangAlarm === alarm, rangAlarms), this.state.alarms)
        });
    };

    handleDateTimeChange(newDateTime) {
        this.setState(prevState => ({
            newAlarm: {
                ...prevState.newAlarm,
                dateTime: newDateTime
            }
        }));
    }

    handleMessageChange(event, value) {
        this.setState(prevState => ({
            newAlarm: {
                ...prevState.newAlarm,
                message: value
            }
        }));
    }

    saveNewAlarm() {
        this.setState(prevState => ({
            alarms: [...prevState.alarms, this.state.newAlarm],
            newAlarm: {
                id: uuidV4(),
                dateTime: moment(),
                message: "",
                isActive: true
            }
        }));
    }

    render() {
        const user = this.props;

        return (
            <div>
                <h1>Alarm Clock</h1>
                <h2>{`Logged in as ${user.display_name}`}</h2>
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
                        value={this.state.newAlarm.dateTime}
                        onChange={this.handleDateTimeChange}
                    />
                    <TextField className="message" floatingLabelText="Add Message" value={this.state.newAlarm.message}
                               onChange={this.handleMessageChange} floatingLabelFixed={true}/>
                    <br/>
                    <RaisedButton className="save" label="Save Alarm" primary={true}
                                  onClick={this.saveNewAlarm} icon={<ActionAlarmAdd/>}/>
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
                                }, this.state.alarms)
                            }
                        </div>
                    </List>
                </Paper>
                <RingDialog checkIfAlarm={this.checkIfAlarm}/>
            </div>
        );
    }
}

export default Alarm;
