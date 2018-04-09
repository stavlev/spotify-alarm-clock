import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAlarmOff from 'material-ui/svg-icons/action/alarm-off';
import Sound from 'react-sound';
import {handleOpen, handleClose} from '../actions/actions';

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
                this.props.checkIfAlarm(handleOpen)}
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
                icon={<ActionAlarmOff />}
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
                            <Sound url={this.props.chosenTrack}
                                   playStatus={this.props.playStatus}
                                   loop={true} />
                            <b>{this.props.alarm.dateTime.format("HH:mm DD-MM-YYYY")}</b>
                            <br />
                            {this.props.alarm.message}
                            <br />
                            {this.props.tiredness}
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
    chosenTrack: PropTypes.string,
    tiredness: PropTypes.string
};
