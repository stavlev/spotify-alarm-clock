import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAlarmOff from 'material-ui/svg-icons/action/alarm-off';
import moment from 'moment';
import uuidV4 from 'uuid/v4';
import Sound from 'react-sound';

const customTitleStyle = {
    textAlign: 'center',
    fontWeight: 'bold'
};

const customContentStyle = {
    width: '20%',
    maxWidth: 'none',
    textAlign: 'center'
};

const actionsContainerStyle = {
    textAlign: 'center'
}

export default class RingDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            playStatus: Sound.status.STOPPED,
            alarm: {
                id: uuidV4(),
                dateTime: moment(),
                message: "",
                isActive: true
            }
        };
    }

    componentDidMount() {
        setInterval(() => this.props.checkIfAlarm(this.handleOpen), 1000);
    }

    handleOpen = (alarm) => {
        this.setState({
            open: true,
            playStatus: Sound.status.PLAYING,
            alarm: alarm
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
            playStatus: Sound.status.STOPPED,
            alarm: {
                id: uuidV4(),
                dateTime: moment(),
                message: "",
                isActive: true
            }
        });
    };

    render() {
        const actions = [
            <RaisedButton
                label="Turn Off Alarm"
                primary={true}
                onClick={this.handleClose}
                icon={<ActionAlarmOff />}
            />
        ];

        return (
            <div>
                <Dialog
                    title="Alarm!"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    titleStyle={customTitleStyle}
                    contentStyle={customContentStyle}
                    actionsContainerStyle={actionsContainerStyle}
                >
                    {
                        <div>
                            <Sound url="https://raw.githubusercontent.com/scottschiller/SoundManager2/master/demo/_mp3/background1.mp3"
                                   playStatus={this.state.playStatus}
                                   loop={true} />
                            <b>{this.state.alarm.dateTime.format("HH:mm DD-MM-YYYY")}</b>
                            <br />
                            {this.state.alarm.message}
                        </div>
                    }
                </Dialog>
            </div>
        );
    }
}

RingDialog.propTypes = {
    checkIfAlarm: PropTypes.func.isRequired
};