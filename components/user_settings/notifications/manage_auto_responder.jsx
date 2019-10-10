// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedHTMLMessage, FormattedMessage} from 'react-intl';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';

import AutosizeTextarea from 'components/autosize_textarea.jsx';
import SettingItemMax from 'components/setting_item_max.jsx';
import {localizeMessage} from 'utils/utils.jsx';
import TimePicker from 'components/time_picker.jsx';

const MESSAGE_MAX_LENGTH = 500;

function getDatePickerStateFromProps(props) {
    const user = props.user;

    const step = 30;
    var options = [];
    var options1 = [];
    var start = '12:00 AM';
    const end = '12:00 AM';
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (moment(start, 'h:mm A').diff(moment(now, 'h:mm A')) >= 0) {
            options.push({value: start, label: start});
        }
        options1.push({value: start, label: start});
        start = moment(start, 'h:mm A').add(step, 'minutes').format('h:mm A');
        const diff = moment(start, 'h:mm A').diff(moment(end, 'h:mm A'));
        if (diff === 0) {
            break;
        }
    }

    let from = new Date();
    let to = null;
    let fromTime = now;
    let toTime = '11:59 PM';
    if (user && user.notify_props && user.notify_props.auto_responder_active === 'true') {
        if (user.notify_props.fromDate) {
            from = new Date(user.notify_props.fromDate);
        }
        if (user.notify_props.toDate) {
            to = new Date(user.notify_props.toDate);
        }
        if (user.notify_props.fromTime) {
            fromTime = user.notify_props.fromTime;
        }
        if (user.notify_props.toTime) {
            toTime = user.notify_props.toTime;
        }
    }
    const today = new Date();
    return {
        options,
        options1,
        from,
        to,
        fromTime,
        toTime,
        fromTimePickerOptions: moment(today).isSame(from, 'day') ? options : options1,
        toTimePickerOptions: moment(today).isSame(to, 'day') ? options : options1,
    };
}

export default class ManageAutoResponder extends React.PureComponent {
    static propTypes = {
        user: PropTypes.object,
        theme: PropTypes.object,
        isOooStatusDropdown: PropTypes.bool,
        isOooDatePickerEnabled: PropTypes.bool,
        autoResponderActive: PropTypes.bool.isRequired,
        autoResponderMessage: PropTypes.string.isRequired,
        updateSection: PropTypes.func.isRequired,
        setParentState: PropTypes.func.isRequired,
        submit: PropTypes.func.isRequired,
        saving: PropTypes.bool.isRequired,
        error: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.state = getDatePickerStateFromProps(props);
    }

    static defaultProps = {
        user: null,
        theme: null,
        isOooStatusDropdown: false,
        isOooDatePickerEnabled: false,
    };

    handleAutoResponderChecked = (e) => {
        this.props.setParentState('autoResponderActive', e.target.checked);
    };

    onMessageChanged = (e) => {
        this.props.setParentState('autoResponderMessage', e.target.value);
    };

    handleTimeChange = (e) => {
        this.props.setParentState(e.target.key, e.target.value);
    }

    showFromMonth() {
        const {from, to} = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    async handleFromChange(from) {
        this.setState({from}, async () => {
            this.props.setParentState('fromDate', this.from.getInput().value);
            const today = new Date();
            if (moment(today).isSame(this.from.getInput().value, 'day')) {
                await this.setState({fromTimePickerOptions: this.state.options});
            } else {
                await this.setState({fromTimePickerOptions: this.state.options1});
            }
        });
    }

    async handleToChange(to) {
        this.setState({to}, async () => {
            this.showFromMonth();
            this.props.setParentState('toDate', this.to.getInput().value);
            const today = new Date();
            if (moment(today).isSame(this.to.getInput().value, 'day')) {
                await this.setState({toTimePickerOptions: this.state.options});
            } else {
                await this.setState({toTimePickerOptions: this.state.options1});
            }
        });
    }

    render() {
        const {
            theme,
            autoResponderActive,
            autoResponderMessage,
        } = this.props;

        let serverError;
        if (this.props.error) {
            serverError = <label className='has-error'>{this.props.error}</label>;
        }

        const inputs = [];
        if (autoResponderActive) {
            this.props.setParentState('autoResponderActive', true);
        }
        const activeToggle = (
            <div
                id='autoResponderCheckbox'
                key='autoResponderCheckbox'
                className='checkbox'
            >
                <label>
                    <input
                        id='autoResponderActive'
                        type='checkbox'
                        checked={autoResponderActive}
                        onChange={this.handleAutoResponderChecked}
                    />
                    <FormattedMessage
                        id='user.settings.notifications.autoResponderEnabled'
                        defaultMessage='Enabled'
                    />
                </label>
            </div>
        );

        let message = null;
        if (this.props.isOooStatusDropdown) {
            message = (
                <div
                    id='autoResponderMessage'
                    key='autoResponderMessage'
                    style={{width: 530, paddingLeft: '20px'}}
                >
                    <div className='padding-top'>
                        <AutosizeTextarea
                            style={{resize: 'none', width: 530}}
                            id='autoResponderMessageInput'
                            className='form-control'
                            rows='5'
                            placeholder={localizeMessage('user.settings.notifications.autoResponderPlaceholder', 'Message')}
                            value={autoResponderMessage}
                            maxLength={MESSAGE_MAX_LENGTH}
                            onChange={this.onMessageChanged}
                        />
                        {serverError}
                    </div>
                    {/* eslint-disable-next-line react/jsx-no-literals */}
                    <div className='text-muted text-right'>
                        {localizeMessage('user.settings.notifications.maxSize', 'Max. character limit is ')}{MESSAGE_MAX_LENGTH}
                    </div>
                </div>
            );
        } else {
            message = (
                <div
                    id='autoResponderMessage'
                    key='autoResponderMessage'
                >
                    <div className='padding-top'>
                        <AutosizeTextarea
                            style={{resize: 'none'}}
                            id='autoResponderMessageInput'
                            className='form-control'
                            rows='5'
                            placeholder={localizeMessage('user.settings.notifications.autoResponderPlaceholder', 'Message')}
                            value={autoResponderMessage}
                            maxLength={MESSAGE_MAX_LENGTH}
                            onChange={this.onMessageChanged}
                        />
                        {serverError}
                    </div>
                    {/* eslint-disable-next-line react/jsx-no-literals */}
                    <div className='text-muted text-right'>
                        {localizeMessage('user.settings.notifications.maxSize', 'Max. character limit is ')}{MESSAGE_MAX_LENGTH}
                    </div>
                </div>
            );
        }

        const {from, to} = this.state;
        const modifiers = {start: from, end: to};
        const color = 'black';
        const fromDatePicker = this.props.isOooDatePickerEnabled && (
            <div style={{display: 'inline-flex', paddingTop: '10px', paddingLeft: '20px', color}}>
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <label style={{paddingRight: 10, paddingTop: 11, color: theme.centerChannelBg === '#282727' ? 'white' : '#333333'}}>Start Time:</label>
                <DayPickerInput
                    ref={(el) => {
                        this.from = el;
                    }}
                    inputProps={{style: dayPickerStyle}}
                    value={from}
                    placeholder='(Optional)'
                    format='LL'
                    dayPickerProps={{
                        selectedDays: [from, {from, to}],
                        disabledDays: {after: to, before: new Date()},
                        toMonth: to,
                        modifiers,
                        numberOfMonths: 1,
                    }}
                    onDayChange={this.handleFromChange}
                />
                <span style={{paddingLeft: 10}}>
                    <TimePicker
                        keyValue={'fromTime'}
                        defaultValue={this.state.fromTime}
                        options={this.state.fromTimePickerOptions}
                        submit={this.props.setParentState}
                    />
                </span>
            </div>
        );
        const toDatePicker = this.props.isOooDatePickerEnabled && (
            <div
                style={{display: 'inline-flex', paddingTop: '10px', paddingLeft: '20px', paddingBottom: '19px', color}}
            >
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <label style={{paddingRight: 18, paddingTop: 10, background: 'inherit', color: theme.centerChannelBg === '#282727' ? 'white' : '#333333'}}>End Time:</label>
                <DayPickerInput
                    ref={(el) => {
                        this.to = el;
                    }}
                    inputProps={{style: dayPickerStyle}}
                    value={to}
                    placeholder='(Optional)'
                    format='LL'
                    dayPickerProps={{
                        selectedDays: [from, {from, to}],
                        disabledDays: {before: from},
                        modifiers,
                        month: to === null ? from : to,
                        fromMonth: to === null ? from : to,
                        numberOfMonths: 1,
                    }}
                    onDayChange={this.handleToChange}
                />
                <span style={{paddingLeft: 10}}>
                    <TimePicker
                        keyValue={'toTime'}
                        defaultValue={this.state.toTime}
                        options={this.state.toTimePickerOptions}
                        submit={this.props.setParentState}
                    />
                </span>
            </div>
        );
        inputs.push(activeToggle);
        if (autoResponderActive) {
            inputs.push(fromDatePicker);
            inputs.push(toDatePicker);
            inputs.push(message);
        }

        let style = null;
        if (this.props.isOooStatusDropdown) {
            style = {width: 530, textAlign: 'justify'};
        }
        inputs.push((
            <div
                key='autoResponderHint'
                style={style}
            >
                <br/>
                <FormattedHTMLMessage
                    id='user.settings.notifications.autoResponderHint'
                    defaultMessage='Set a custom message that will be automatically sent in response to Direct Messages. Mentions in Public and Private Channels will not trigger the automated reply. Enabling Automatic Replies sets your status to Out of Office and disables email and push notifications.'
                />
            </div>
        ));
        return (
            <div className=''>
                <SettingItemMax
                    width='full'
                    shiftEnter={true}
                    submit={this.props.submit}
                    saving={this.props.saving}
                    inputs={inputs}
                    updateSection={this.props.updateSection}
                />
            </div>
        );
    }
}

const dayPickerStyle = {
    height: 38,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(204, 204, 204)',
    paddingRight: 10,
    textAlign: 'center',
};
const now = moment().format('LT');
