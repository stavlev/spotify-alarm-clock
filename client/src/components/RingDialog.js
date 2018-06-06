import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAlarmOff from 'material-ui/svg-icons/action/alarm-off';
import Sound from 'react-sound';
import {handleOpen, handleClose, handleUserSleepQualityInput} from '../actions/actions';

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
};

export default class RingDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setInterval(() => {
                if (!this.props.open) {
                    this.props.checkIfAlarm(handleOpen)
                }
            }
            , 1000);
    }

    render() {
        const {dispatch} = this.props;

        const actions = [
            <RaisedButton
                label="Turn Off Alarm"
                primary={true}
                onClick={() => dispatch(handleClose())}
                icon={<ActionAlarmOff/>}
            />
        ];

        return (
            <div>
                <Dialog
                    title="Alarm!"
                    actions={actions}
                    modal={true}
                    open={this.props.open}
                    titleStyle={customTitleStyle}
                    contentStyle={customContentStyle}
                    actionsContainerStyle={actionsContainerStyle}
                >
                    {
                        <div>
                            <Sound url="https://www.youtube.com/watch?v=VOp8bB0IZQs"
                                   playStatus={this.props.playStatus}
                                   loop={true}/>
                            <Sound url={this.props.chosenTrack}
                                   playStatus={
                                       (this.props.isSleepQualityInputReceived && this.props.chosenTrack) ?
                                           Sound.status.PLAYING :
                                           Sound.status.STOPPED
                                   }
                                   loop={false}/>
                            <b>{this.props.alarm.dateTime.format("HH:mm DD-MM-YYYY")}</b>
                            <br/>
                            {this.props.alarm.message}
                            <br/>
                            <p>Have you slept well?</p>
                            <button onClick={() => dispatch(handleUserSleepQualityInput(this.props.tracks, true))}
                                    disabled={this.props.isSleepQualityInputReceived}>
                                Yes
                            </button>
                            <button onClick={() => dispatch(handleUserSleepQualityInput(this.props.tracks, false))}
                                    disabled={this.props.isSleepQualityInputReceived}>
                                No
                            </button>
                        </div>
                    }
                </Dialog>
            </div>
        );
    }
}

RingDialog.propTypes = {
    dispatch: PropTypes.func.isRequired,
    checkIfAlarm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    alarm: PropTypes.object.isRequired,
    playStatus: PropTypes.string.isRequired,
    isSleepQualityInputReceived: PropTypes.bool.isRequired,
    tracks: PropTypes.array.isRequired,
    chosenTrack: PropTypes.string,
};
